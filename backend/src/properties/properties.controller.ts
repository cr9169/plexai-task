import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { AiAnalysisDto } from './dto/ai-analysis.dto';
import { GetPropertiesQueryDto } from './dto/get-properties-query.dto';
import { AiAnalysisResult } from './interfaces/ai-analysis.interface';
import { UnderwritingResult } from './interfaces/underwriting.interface';
import { AiAnalysisService } from './ai-analysis.service';
import { PropertiesService } from './properties.service';
import { UnderwritingService } from './underwriting.service';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly underwritingService: UnderwritingService,
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  @Get()
  findAll(@Query() query: GetPropertiesQueryDto) {
    return this.propertiesService.findAll(query);
  }

  // declared before @Get(':id') to prevent route shadowing
  @Get(':id/underwriting')
  getUnderwriting(@Param('id') id: string): UnderwritingResult {
    return this.underwritingService.calculateForProperty(id);
  }

  @Post(':id/ai-analysis')
  @HttpCode(200)
  async getAiAnalysis(
    @Param('id') id: string,
    @Body() body: AiAnalysisDto,
  ): Promise<AiAnalysisResult> {
    return this.aiAnalysisService.analyzeForProperty(id, body.focusAreas);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }
}
