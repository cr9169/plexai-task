export type PropertyType = 'multifamily' | 'office' | 'retail' | 'industrial';

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface PropertyIncome {
  annualRent: number;
  parkingIncome: number;
  laundryIncome: number;
  otherIncome: number;
}

export interface PropertyExpenses {
  taxes: number;
  insurance: number;
  maintenance: number;
  utilities: number;
  managementFeePct: number;
  managementFeeFixed?: number;
}

export interface PropertyLoan {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
}

export interface Property {
  id: string;
  name: string;
  address: PropertyAddress;
  type: PropertyType;
  sqft: number;
  units: number | null;
  yearBuilt: number;
  purchasePrice: number;
  income: PropertyIncome;
  vacancyRate: number;
  expenses: PropertyExpenses;
  loan: PropertyLoan | null;
}

export interface PaginatedProperties {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetPropertiesQuery {
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export type CapRateFlag = 'outlier' | null;
export type DscrFlag = 'below_threshold' | null;

export interface UnderwritingResult {
  propertyId: string;
  grossIncome: number;
  effectiveGrossIncome: number;
  managementFee: number;
  operatingExpenses: number;
  noi: number;
  capRate: number;
  capRateFlag: CapRateFlag;
  annualDebtService: number | null;
  dscr: number | null;
  dscrFlag: DscrFlag;
  cashOnCashReturn: number;
  isAllCash: boolean;
}

export interface HighlightOrRisk {
  title: string;
  description: string;
}

export interface AiAnalysisResult {
  highlights: HighlightOrRisk[];
  risks: HighlightOrRisk[];
  overallRisk: 'low' | 'medium' | 'high';
  summary: string;
}
