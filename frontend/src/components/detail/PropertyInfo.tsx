import type { Property, UnderwritingResult } from '../../types/property.types';
import { capitalize, formatCurrency, formatNumber, formatPercent, PROPERTY_TYPE_VARIANT } from '../../utils/format';
import Badge from '../common/Badge';

interface PropertyInfoProps {
  property: Property;
  metrics: UnderwritingResult;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
      {children}
    </h3>
  );
}

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function TableRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <tr className={bold ? 'bg-gray-50' : undefined}>
      <td className={`py-2 text-sm text-gray-600 ${bold ? 'font-semibold text-gray-800' : ''}`}>{label}</td>
      <td className={`py-2 text-right text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-900'}`}>{value}</td>
    </tr>
  );
}

export default function PropertyInfo({ property, metrics }: PropertyInfoProps) {
  const { address, income, expenses, loan } = property;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <SectionHeading>Overview</SectionHeading>
        <div className="divide-y divide-gray-100">
          <InfoRow label="Name" value={property.name} />
          <InfoRow
            label="Address"
            value={`${address.street}, ${address.city}, ${address.state} ${address.zip}`}
          />
          <InfoRow
            label="Type"
            value={<Badge label={capitalize(property.type)} variant={PROPERTY_TYPE_VARIANT[property.type]} />}
          />
          <InfoRow label="Square Footage" value={`${formatNumber(property.sqft)} sq ft`} />
          <InfoRow label="Year Built" value={String(property.yearBuilt)} />
          <InfoRow label="Units" value={property.units !== null ? String(property.units) : 'N/A'} />
          <InfoRow label="Purchase Price" value={formatCurrency(property.purchasePrice)} />
          <InfoRow label="Vacancy Rate" value={formatPercent(property.vacancyRate)} />
        </div>
      </section>

      {/* Income Breakdown */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <SectionHeading>Income Breakdown</SectionHeading>
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            <TableRow label="Annual Rent" value={formatCurrency(income.annualRent)} />
            <TableRow label="Parking Income" value={formatCurrency(income.parkingIncome)} />
            <TableRow label="Laundry Income" value={formatCurrency(income.laundryIncome)} />
            <TableRow label="Other Income" value={formatCurrency(income.otherIncome)} />
            <TableRow label="Gross Income" value={formatCurrency(metrics.grossIncome)} bold />
            <TableRow label="Vacancy Rate" value={formatPercent(property.vacancyRate)} />
          </tbody>
        </table>
      </section>

      {/* Expense Breakdown */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <SectionHeading>Expense Breakdown</SectionHeading>
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            <TableRow label="Property Taxes" value={formatCurrency(expenses.taxes)} />
            <TableRow label="Insurance" value={formatCurrency(expenses.insurance)} />
            <TableRow label="Maintenance" value={formatCurrency(expenses.maintenance)} />
            <TableRow label="Utilities" value={formatCurrency(expenses.utilities)} />
            <TableRow label="Management Fee" value={formatCurrency(metrics.managementFee)} />
            <TableRow label="Total Expenses" value={formatCurrency(metrics.operatingExpenses)} bold />
          </tbody>
        </table>
      </section>

      {/* Loan Terms */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <SectionHeading>Loan Terms</SectionHeading>
        {loan !== null ? (
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              <TableRow label="Loan Amount" value={formatCurrency(loan.loanAmount)} />
              <TableRow label="Interest Rate" value={formatPercent(loan.annualInterestRate)} />
              <TableRow label="Loan Term" value={`${loan.loanTermYears} years`} />
            </tbody>
          </table>
        ) : (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            All-Cash Purchase
          </span>
        )}
      </section>
    </div>
  );
}
