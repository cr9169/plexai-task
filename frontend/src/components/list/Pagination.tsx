import type { PaginatedProperties } from '../../types/property.types';

interface PaginationProps {
  meta: PaginatedProperties['meta'];
  onPageChange: (page: number) => void;
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const PAGE_WINDOW = 2; // pages shown on each side of current

  const left = Math.max(2, current - PAGE_WINDOW);
  const right = Math.min(total - 1, current + PAGE_WINDOW);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, total, limit, totalPages } = meta;

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{from}</span>–<span className="font-medium">{to}</span> of{' '}
        <span className="font-medium">{total}</span> properties
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Prev
        </button>

        {pages.map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-sm text-gray-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                pageNumber === page
                  ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
