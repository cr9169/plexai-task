export enum PropertyType {
  Multifamily = 'multifamily',
  Office = 'office',
  Retail = 'retail',
  Industrial = 'industrial',
}

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
  /** Percentage of Effective Gross Income charged as management fee (e.g. 0.08 = 8%). Always present; may be 0. */
  managementFeePct: number;
  /** Fixed annual management fee in dollars. Mutually exclusive with managementFeePct in practice; only present on some records. */
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
