import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "@/utils/helpers";

export function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems <= pageSize) return null;
  const range = getPaginationRange(page, pageCount);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <span className="pagination-info">
        {start}–{end} of {totalItems}
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft />
        </button>
        {range.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pagination-btn ${page === item ? "current" : ""}`}
              aria-label={`Page ${item}`}
              aria-current={page === item ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className="pagination-btn"
          aria-label="Next page"
          disabled={page === pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
export default Pagination;
