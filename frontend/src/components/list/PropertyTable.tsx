import { useNavigate } from 'react-router-dom';
import type { Property } from '../../types/property.types';
import { capitalize, formatCurrency, PROPERTY_TYPE_VARIANT } from '../../utils/format';
import Badge from '../common/Badge';

interface PropertyTableProps {
  properties: Property[];
  loading: boolean;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-gray-200" />
        </td>
      ))}
    </tr>
  );
}

export default function PropertyTable({ properties, loading }: PropertyTableProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Address', 'Type', 'Purchase Price', 'Units'].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
              : properties.length === 0
              ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-500">
                    No properties match your filters.
                  </td>
                </tr>
              )
              : properties.map((property) => (
                <tr
                  key={property.id}
                  onClick={() => navigate(`/properties/${property.id}`)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                    {property.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {property.address.street}, {property.address.city}, {property.address.state}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge label={capitalize(property.type)} variant={PROPERTY_TYPE_VARIANT[property.type]} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatCurrency(property.purchasePrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {property.units ?? '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="sm:hidden space-y-3">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
          ))
          : properties.length === 0
          ? (
            <p className="py-12 text-center text-sm text-gray-500">
              No properties match your filters.
            </p>
          )
          : properties.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/properties/${property.id}`)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-blue-600">{property.name}</span>
                <Badge label={capitalize(property.type)} variant={PROPERTY_TYPE_VARIANT[property.type]} />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {property.address.street}, {property.address.city}, {property.address.state}
              </p>
              <div className="mt-2 flex gap-4 text-xs text-gray-700">
                <span>{formatCurrency(property.purchasePrice)}</span>
                <span>{property.units !== null ? `${property.units} units` : 'No units'}</span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
