import { useEffect, useState } from 'react';
import { getProperties } from '../api/properties.api';
import type { GetPropertiesQuery, PaginatedProperties } from '../types/property.types';
import SearchBar from '../components/list/SearchBar';
import PropertyFilters from '../components/list/PropertyFilters';
import PropertyTable from '../components/list/PropertyTable';
import Pagination from '../components/list/Pagination';
import ErrorMessage from '../components/common/ErrorMessage';

const DEFAULT_FILTERS: GetPropertiesQuery = {
  page: 1,
  limit: 10,
};

export default function ListPage() {
  const [filters, setFilters] = useState<GetPropertiesQuery>(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<PaginatedProperties | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getProperties(filters)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load properties. Please try again.';
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, retryCount]);

  function handleFiltersChange(partial: Partial<GetPropertiesQuery>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  const visibleProperties = data
    ? searchTerm.trim()
      ? data.data.filter((property) =>
          property.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        )
      : data.data
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Property Deal Analyzer</h1>
          <p className="mt-1 text-sm text-gray-500">Browse and analyze commercial real estate deals</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
        <SearchBar value={searchTerm} onSearch={setSearchTerm} />
        {searchTerm.trim() && (
          <p className="text-xs text-amber-600">
            Showing matches on this page only. Clear search to browse all pages.
          </p>
        )}
        <PropertyFilters filters={filters} onChange={handleFiltersChange} />

        {error ? (
          <ErrorMessage
            message={error}
            onRetry={() => setRetryCount((count) => count + 1)}
          />
        ) : (
          <>
            <PropertyTable properties={visibleProperties} loading={loading} />
            {data && !loading && (
              <Pagination
                meta={data.meta}
                onPageChange={(page) => handleFiltersChange({ page })}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
