import { useState } from 'react';
import type { AiAnalysisResult } from '../../types/property.types';
import { postAiAnalysis } from '../../api/properties.api';
import Spinner from '../common/Spinner';
import AnalysisItemCard from './AnalysisItemCard';

interface AiAnalysisPanelProps {
  propertyId: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const riskBadgeClasses: Record<AiAnalysisResult['overallRisk'], string> = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};

const riskLabels: Record<AiAnalysisResult['overallRisk'], string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

export default function AiAnalysisPanel({ propertyId }: AiAnalysisPanelProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAnalyze() {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const data = await postAiAnalysis(propertyId);
      setResult(data);
      setStatus('success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setErrorMessage(message);
      setStatus('error');
    }
  }

  function handleReset() {
    setStatus('idle');
    setResult(null);
    setErrorMessage(null);
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800">AI Deal Analysis</h3>

      {status === 'idle' && (
        <div className="mt-3">
          <p className="text-sm text-gray-500">
            Get an AI-powered qualitative analysis of this investment opportunity.
          </p>
          <button
            onClick={handleAnalyze}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Analyze Deal
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="mt-6 flex flex-col items-center gap-3 py-6">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Analyzing deal... this may take up to 10 seconds.</p>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="mt-4">
          <div className="rounded-md border border-red-300 bg-red-50 p-4">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
          <button
            onClick={handleReset}
            className="mt-3 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {status === 'success' && result && (
        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold ${riskBadgeClasses[result.overallRisk]}`}
            >
              Overall Risk: {riskLabels[result.overallRisk]}
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Highlights</h4>
            <div className="space-y-2">
              {result.highlights.map((highlight) => (
                <AnalysisItemCard key={highlight.title} item={highlight} variant="highlight" />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Risks</h4>
            <div className="space-y-2">
              {result.risks.map((risk) => (
                <AnalysisItemCard key={risk.title} item={risk} variant="risk" />
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Re-analyze
          </button>
        </div>
      )}
    </section>
  );
}
