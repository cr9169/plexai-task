import { PropertyExpenses, PropertyIncome, PropertyLoan } from '../interfaces/property.interface';

export function roundTo(value: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}

export function calculateGrossIncome(income: PropertyIncome): number {
  return income.annualRent + income.parkingIncome + income.laundryIncome + income.otherIncome;
}

export function calculateEffectiveGrossIncome(grossIncome: number, vacancyRate: number): number {
  return grossIncome * (1 - vacancyRate);
}

export function calculateManagementFee(
  expenses: PropertyExpenses,
  effectiveGrossIncome: number,
): number {
  // Fixed fee takes precedence only when managementFeePct is explicitly 0.
  // A record with both fields set and managementFeePct > 0 uses the percentage.
  if (expenses.managementFeeFixed !== undefined && expenses.managementFeePct === 0) {
    return expenses.managementFeeFixed;
  }
  return expenses.managementFeePct * effectiveGrossIncome;
}

export function calculateOperatingExpenses(
  expenses: PropertyExpenses,
  managementFee: number,
): number {
  return (
    expenses.taxes +
    expenses.insurance +
    expenses.maintenance +
    expenses.utilities +
    managementFee
  );
}

export function calculateNoi(effectiveGrossIncome: number, operatingExpenses: number): number {
  return effectiveGrossIncome - operatingExpenses;
}

export function calculateCapRate(noi: number, purchasePrice: number): number {
  return noi / purchasePrice;
}

export function calculateAnnualDebtService(loan: PropertyLoan | null): number | null {
  if (loan === null) {
    return null;
  }

  const { loanAmount, annualInterestRate, loanTermYears } = loan;
  const numberOfPayments = loanTermYears * 12;

  if (annualInterestRate === 0) {
    const monthlyPayment = loanAmount / numberOfPayments;
    return monthlyPayment * 12;
  }

  const monthlyRate = annualInterestRate / 12;
  const compoundFactor = Math.pow(1 + monthlyRate, numberOfPayments);
  const monthlyPayment = (loanAmount * (monthlyRate * compoundFactor)) / (compoundFactor - 1);
  return monthlyPayment * 12;
}

export function calculateDscr(noi: number, annualDebtService: number | null): number | null {
  if (annualDebtService === null || annualDebtService === 0) {
    return null;
  }
  return noi / annualDebtService;
}

export function calculateCashOnCashReturn(
  noi: number,
  annualDebtService: number | null,
  purchasePrice: number,
  loanAmount: number | null,
): number {
  const equityInvested = loanAmount === null ? purchasePrice : purchasePrice - loanAmount;
  const annualCashFlow = annualDebtService === null ? noi : noi - annualDebtService;
  return annualCashFlow / equityInvested;
}
