import type { UnderwritingResult } from '../../types/property.types';
import { formatCurrency, formatMultiple, formatPercent } from '../../utils/format';
import MetricCard from './MetricCard';

interface FinancialMetricsProps {
  metrics: UnderwritingResult;
}

export default function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  const {
    noi,
    capRate,
    capRateFlag,
    annualDebtService,
    dscr,
    dscrFlag,
    cashOnCashReturn,
    isAllCash,
  } = metrics;

  const allCashNote = isAllCash ? 'All-Cash Purchase — not applicable' : undefined;

  const noiVariant = noi > 0 ? 'green' : 'red';
  const noiLabel = noi > 0 ? 'Healthy' : 'Below Zero';

  const capRateVariant = capRateFlag === 'outlier' ? 'yellow' : 'green';
  const capRateLabel = capRateFlag === 'outlier' ? 'Outlier' : 'Healthy';

  const debtServiceLabel = annualDebtService === null ? 'N/A' : 'Info';

  const dscrVariant =
    dscr === null ? 'grey' : dscrFlag === 'below_threshold' ? 'red' : 'green';
  const dscrLabel =
    dscr === null ? 'N/A' : dscrFlag === 'below_threshold' ? 'Below Threshold' : 'Healthy';

  const cocVariant =
    cashOnCashReturn === null
      ? 'grey'
      : cashOnCashReturn > 0
      ? 'green'
      : 'red';
  const cocLabel =
    cashOnCashReturn === null
      ? 'N/A'
      : cashOnCashReturn > 0
      ? 'Healthy'
      : 'Negative';

  return (
    <section className="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Financial Metrics
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Net Operating Income"
          value={formatCurrency(noi)}
          badgeVariant={noiVariant}
          badgeLabel={noiLabel}
        />
        <MetricCard
          label="Cap Rate"
          value={formatPercent(capRate)}
          badgeVariant={capRateVariant}
          badgeLabel={capRateLabel}
        />
        <MetricCard
          label="Annual Debt Service"
          value={annualDebtService !== null ? formatCurrency(annualDebtService) : 'N/A'}
          badgeVariant="grey"
          badgeLabel={debtServiceLabel}
          note={allCashNote}
        />
        <MetricCard
          label="DSCR"
          value={dscr !== null ? formatMultiple(dscr) : 'N/A'}
          badgeVariant={dscrVariant}
          badgeLabel={dscrLabel}
          note={allCashNote}
        />
        <MetricCard
          label="Cash-on-Cash Return"
          value={formatPercent(cashOnCashReturn)}
          badgeVariant={cocVariant}
          badgeLabel={cocLabel}
        />
      </div>
    </section>
  );
}
