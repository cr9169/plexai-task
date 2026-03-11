import { useState } from 'react';
import type { GetPropertiesQuery, PropertyType } from '../../types/property.types';

interface PropertyFiltersProps {
  filters: GetPropertiesQuery;
  onChange: (filters: Partial<GetPropertiesQuery>) => void;
}

// Intentional fixed subset matching the cities present in the backend data
const SUPPORTED_FILTER_CITIES = [
  'Austin', 'Atlanta', 'Charlotte', 'Denver', 'Miami',
  'Nashville', 'Orlando', 'Phoenix', 'Raleigh', 'Tampa',
];

const TYPES: { label: string; value: PropertyType }[] = [
  { label: 'Multifamily', value: 'multifamily' },
  { label: 'Office', value: 'office' },
  { label: 'Retail', value: 'retail' },
  { label: 'Industrial', value: 'industrial' },
];

export default function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const [minPriceInput, setMinPriceInput] = useState(
    filters.minPrice !== undefined ? String(filters.minPrice) : '',
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : '',
  );

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value || undefined;
    onChange({ city, page: 1 });
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const type = (e.target.value as PropertyType) || undefined;
    onChange({ type, page: 1 });
  }

  function handleMinPriceBlur() {
    const parsed = minPriceInput ? Number(minPriceInput) : undefined;
    onChange({ minPrice: parsed, page: 1 });
  }

  function handleMaxPriceBlur() {
    const parsed = maxPriceInput ? Number(maxPriceInput) : undefined;
    onChange({ maxPrice: parsed, page: 1 });
  }

  function handleClearPrice() {
    setMinPriceInput('');
    setMaxPriceInput('');
    onChange({ minPrice: undefined, maxPrice: undefined, page: 1 });
  }

  const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">City</label>
        <select
          value={filters.city ?? ''}
          onChange={handleCityChange}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Cities</option>
          {SUPPORTED_FILTER_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Property Type</label>
        <select
          value={filters.type ?? ''}
          onChange={handleTypeChange}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {TYPES.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Price Range</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            onBlur={handleMinPriceBlur}
            placeholder="Min $"
            className="w-28 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            min="0"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            onBlur={handleMaxPriceBlur}
            placeholder="Max $"
            className="w-28 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {hasPriceFilter && (
            <button
              onClick={handleClearPrice}
              className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
