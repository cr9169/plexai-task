export interface UnderwritingResult {
  propertyId: string;
  grossIncome: number;
  effectiveGrossIncome: number;
  managementFee: number;
  operatingExpenses: number;
  noi: number;
  capRate: number;
  capRateFlag: 'outlier' | null;
  annualDebtService: number | null;
  dscr: number | null;
  dscrFlag: 'below_threshold' | null;
  cashOnCashReturn: number;
  isAllCash: boolean;
}
