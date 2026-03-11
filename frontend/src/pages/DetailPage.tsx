import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProperty, getUnderwriting } from '../api/properties.api';
import type { Property, UnderwritingResult } from '../types/property.types';
import PropertyInfo from '../components/detail/PropertyInfo';
import FinancialMetrics from '../components/detail/FinancialMetrics';
import AiAnalysisPanel from '../components/detail/AiAnalysisPanel';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [metrics, setMetrics] = useState<UnderwritingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.all([getProperty(id), getUnderwriting(id)])
      .then(([prop, uwResult]) => {
        if (!cancelled) {
          setProperty(prop);
          setMetrics(uwResult);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load property details.';
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" label="Loading property details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to all properties
          </button>
        </div>
      </div>
    );
  }

  if (!property || !metrics) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="mb-2 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {property.address.city}, {property.address.state}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <PropertyInfo property={property} metrics={metrics} />
        <FinancialMetrics metrics={metrics} />
        <AiAnalysisPanel propertyId={property.id} />
      </main>
    </div>
  );
}
