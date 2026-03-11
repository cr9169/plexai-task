import {
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic, {
  APIConnectionTimeoutError,
  AuthenticationError,
  BadRequestError,
  RateLimitError,
} from '@anthropic-ai/sdk';
import { AI_CONFIG, ENV_KEYS } from '../constants';
import { PropertiesService } from './properties.service';
import { UnderwritingService } from './underwriting.service';
import { AiAnalysisResult, HighlightOrRisk } from './interfaces/ai-analysis.interface';
import { Property } from './interfaces/property.interface';
import { UnderwritingResult } from './interfaces/underwriting.interface';

@Injectable()
export class AiAnalysisService {
  private readonly anthropic: Anthropic;

  constructor(
    configService: ConfigService,
    private readonly propertiesService: PropertiesService,
    private readonly underwritingService: UnderwritingService,
  ) {
    const apiKey = configService.getOrThrow<string>(ENV_KEYS.ANTHROPIC_API_KEY);
    this.anthropic = new Anthropic({ apiKey });
  }

  async analyzeForProperty(id: string, focusAreas?: string[]): Promise<AiAnalysisResult> {
    const property = this.propertiesService.findOne(id);
    const metrics = this.underwritingService.calculate(property);
    return this.analyze(property, metrics, focusAreas);
  }

  private async analyze(
    property: Property,
    metrics: UnderwritingResult,
    focusAreas?: string[],
  ): Promise<AiAnalysisResult> {
    const userPrompt = this.buildUserPrompt(property, metrics, focusAreas);

    let rawText: string;

    try {
      const response = await this.anthropic.messages.create({
        model: AI_CONFIG.MODEL,
        max_tokens: AI_CONFIG.MAX_TOKENS,
        system:
          'You are a commercial real estate investment analyst. You will be given property data and financial metrics. Respond ONLY with a valid JSON object — no markdown, no explanation, no code fences. The JSON must exactly match the schema provided.',
        messages: [{ role: 'user', content: userPrompt }],
      });

      const firstContentBlock = response.content[0];
      if (firstContentBlock.type !== 'text') {
        throw new InternalServerErrorException('Unexpected AI response type.');
      }
      rawText = firstContentBlock.text;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw this.mapAnthropicError(error);
    }

    return this.parseAndValidateResponse(rawText);
  }

  private buildUserPrompt(
    property: Property,
    metrics: UnderwritingResult,
    focusAreas?: string[],
  ): string {
    const address = property.address;
    const unitsLine = property.units !== null ? `\nUnits: ${property.units}` : '';

    const sections: string[] = [
      `## Property Overview
Name: ${property.name}
Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}
Type: ${property.type}
Square Footage: ${property.sqft.toLocaleString()} sqft
Year Built: ${property.yearBuilt}${unitsLine}
Purchase Price: $${property.purchasePrice.toLocaleString()}`,

      `## Income & Vacancy
Annual Rent: $${property.income.annualRent.toLocaleString()}
Parking Income: $${property.income.parkingIncome.toLocaleString()}
Laundry Income: $${property.income.laundryIncome.toLocaleString()}
Other Income: $${property.income.otherIncome.toLocaleString()}
Gross Income: $${metrics.grossIncome.toLocaleString()}
Vacancy Rate: ${(property.vacancyRate * 100).toFixed(1)}%
Effective Gross Income (EGI): $${metrics.effectiveGrossIncome.toLocaleString()}`,

      `## Expenses
Taxes: $${property.expenses.taxes.toLocaleString()}
Insurance: $${property.expenses.insurance.toLocaleString()}
Maintenance: $${property.expenses.maintenance.toLocaleString()}
Utilities: $${property.expenses.utilities.toLocaleString()}
Management Fee: $${metrics.managementFee.toLocaleString()}
Total Operating Expenses: $${metrics.operatingExpenses.toLocaleString()}`,

      `## Financial Metrics
Net Operating Income (NOI): $${metrics.noi.toLocaleString()}
Cap Rate: ${(metrics.capRate * 100).toFixed(2)}%${metrics.capRateFlag ? ` [FLAG: ${metrics.capRateFlag}]` : ''}
Annual Debt Service: ${metrics.annualDebtService !== null ? `$${metrics.annualDebtService.toLocaleString()}` : 'N/A (all-cash)'}
DSCR: ${metrics.dscr !== null ? metrics.dscr.toFixed(2) : 'N/A (all-cash)'}${metrics.dscrFlag ? ` [FLAG: ${metrics.dscrFlag}]` : ''}
Cash-on-Cash Return: ${(metrics.cashOnCashReturn * 100).toFixed(2)}%
All-Cash Purchase: ${metrics.isAllCash ? 'Yes' : 'No'}`,

      `## Required JSON Schema
Respond with exactly this structure:
{
  "highlights": [{ "title": "string", "description": "string" }],
  "risks": [{ "title": "string", "description": "string" }],
  "overallRisk": "low | medium | high",
  "summary": "string"
}`,

      `## Constraints
- highlights: exactly ${AI_CONFIG.RESPONSE_MIN_ITEMS} to ${AI_CONFIG.RESPONSE_MAX_ITEMS} items
- risks: exactly ${AI_CONFIG.RESPONSE_MIN_ITEMS} to ${AI_CONFIG.RESPONSE_MAX_ITEMS} items
- overallRisk: must be exactly one of: "low", "medium", or "high"
- summary: a concise paragraph summarising the investment opportunity
- Respond ONLY with the JSON object — no markdown, no code fences, no explanation`,
    ];

    if (focusAreas !== undefined) {
      sections.push(`Pay particular attention to these areas: ${focusAreas.join(', ')}`);
    }

    return sections.join('\n\n');
  }

  private parseAndValidateResponse(rawText: string): AiAnalysisResult {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      throw new HttpException(
        'AI returned an unreadable response. Please try again.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!this.isValidAiAnalysisResult(parsed)) {
      throw new HttpException(
        'AI returned a malformed response. Please try again.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return parsed;
  }

  private isValidAiAnalysisResult(value: unknown): value is AiAnalysisResult {
    if (typeof value !== 'object' || value === null) return false;

    const response = value as Record<string, unknown>;

    if (!Array.isArray(response.highlights) || !Array.isArray(response.risks)) return false;
    if (
      response.highlights.length < AI_CONFIG.RESPONSE_MIN_ITEMS ||
      response.highlights.length > AI_CONFIG.RESPONSE_MAX_ITEMS
    ) return false;
    if (
      response.risks.length < AI_CONFIG.RESPONSE_MIN_ITEMS ||
      response.risks.length > AI_CONFIG.RESPONSE_MAX_ITEMS
    ) return false;

    const isValidItem = (item: unknown): item is HighlightOrRisk => {
      if (typeof item !== 'object' || item === null) return false;
      const itemRecord = item as Record<string, unknown>;
      return (
        typeof itemRecord.title === 'string' && itemRecord.title.length > 0 &&
        typeof itemRecord.description === 'string' && itemRecord.description.length > 0
      );
    };

    if (!response.highlights.every(isValidItem)) return false;
    if (!response.risks.every(isValidItem)) return false;

    if (response.overallRisk !== 'low' && response.overallRisk !== 'medium' && response.overallRisk !== 'high') {
      return false;
    }

    if (typeof response.summary !== 'string' || response.summary.length === 0) return false;

    return true;
  }

  private mapAnthropicError(error: unknown): HttpException {
    if (error instanceof APIConnectionTimeoutError) {
      return new GatewayTimeoutException('AI analysis timed out. Please try again.');
    }
    if (error instanceof RateLimitError) {
      return new HttpException(
        'AI service rate limit reached. Please try again shortly.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (error instanceof AuthenticationError) {
      return new InternalServerErrorException('AI service configuration error.');
    }
    if (error instanceof BadRequestError) {
      return new InternalServerErrorException('AI model configuration error.');
    }
    return new InternalServerErrorException('AI analysis failed unexpectedly.');
  }
}
