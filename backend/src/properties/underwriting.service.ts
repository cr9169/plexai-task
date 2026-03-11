import { Injectable } from '@nestjs/common';
import { UNDERWRITING } from '../constants';
import { PropertiesService } from './properties.service';
import { Property } from './interfaces/property.interface';
import { UnderwritingResult } from './interfaces/underwriting.interface';
import {
  calculateAnnualDebtService,
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateDscr,
  calculateEffectiveGrossIncome,
  calculateGrossIncome,
  calculateManagementFee,
  calculateNoi,
  calculateOperatingExpenses,
  roundTo,
} from './utils/calculations';

@Injectable()
export class UnderwritingService {
  constructor(private readonly propertiesService: PropertiesService) {}

  calculateForProperty(id: string): UnderwritingResult {
    const property = this.propertiesService.findOne(id);
    return this.calculate(property);
  }

  calculate(property: Property): UnderwritingResult {
    const grossIncome = calculateGrossIncome(property.income);
    const effectiveGrossIncome = calculateEffectiveGrossIncome(grossIncome, property.vacancyRate);
    const managementFee = calculateManagementFee(property.expenses, effectiveGrossIncome);
    const operatingExpenses = calculateOperatingExpenses(property.expenses, managementFee);
    const noi = calculateNoi(effectiveGrossIncome, operatingExpenses);
    const capRate = calculateCapRate(noi, property.purchasePrice);
    const annualDebtService = calculateAnnualDebtService(property.loan);
    const dscr = calculateDscr(noi, annualDebtService);
    const cashOnCashReturn = calculateCashOnCashReturn(
      noi,
      annualDebtService,
      property.purchasePrice,
      property.loan?.loanAmount ?? null,
    );

    const capRateFlag: 'outlier' | null =
      capRate < UNDERWRITING.CAP_RATE_LOW_THRESHOLD || capRate > UNDERWRITING.CAP_RATE_HIGH_THRESHOLD
        ? 'outlier'
        : null;

    const dscrFlag: 'below_threshold' | null =
      dscr !== null && dscr < UNDERWRITING.DSCR_MIN_THRESHOLD ? 'below_threshold' : null;

    return {
      propertyId: property.id,
      grossIncome: roundTo(grossIncome, UNDERWRITING.MONETARY_DECIMAL_PLACES),
      effectiveGrossIncome: roundTo(effectiveGrossIncome, UNDERWRITING.MONETARY_DECIMAL_PLACES),
      managementFee: roundTo(managementFee, UNDERWRITING.MONETARY_DECIMAL_PLACES),
      operatingExpenses: roundTo(operatingExpenses, UNDERWRITING.MONETARY_DECIMAL_PLACES),
      noi: roundTo(noi, UNDERWRITING.MONETARY_DECIMAL_PLACES),
      capRate: roundTo(capRate, UNDERWRITING.RATIO_DECIMAL_PLACES),
      capRateFlag,
      annualDebtService:
        annualDebtService !== null
          ? roundTo(annualDebtService, UNDERWRITING.MONETARY_DECIMAL_PLACES)
          : null,
      dscr: dscr !== null ? roundTo(dscr, UNDERWRITING.MONETARY_DECIMAL_PLACES) : null,
      dscrFlag,
      cashOnCashReturn: roundTo(cashOnCashReturn, UNDERWRITING.RATIO_DECIMAL_PLACES),
      isAllCash: property.loan === null,
    };
  }
}
