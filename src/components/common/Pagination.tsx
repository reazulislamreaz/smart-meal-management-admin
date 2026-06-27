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

  const btnBase =
    "grid place-items-center min-w-[28px] h-[28px] px-[6px] border rounded-[4px] text-[11px] font-medium transition-[background,border-color,color,transform] duration-150 disabled:opacity-40 disabled:cursor-not-allowed enabled:active:scale-[.96] [&_svg]:w-3 [&_svg]:h-3";
  const btnIdle =
    "border-[#dfe1e5] bg-white text-[#34363a] enabled:hover:bg-[#f0f1f3] enabled:hover:border-[#c9ccd0]";
  const btnCurrent = "text-white bg-[#17181a] border-[#17181a]";

  return (
    <div className="min-h-[48px] px-[14px] flex items-center justify-between gap-3 border-t border-[#eceef0] max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-2 max-[620px]:py-[10px]">
      <span className="text-[#777b80] text-[12px] whitespace-nowrap">
        {start}–{end} of {totalItems}
      </span>
      <div className="flex items-center justify-end gap-1 flex-wrap max-[620px]:justify-center">
        <button
          type="button"
          className={`${btnBase} ${btnIdle}`}
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft />
        </button>
        {range.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="grid place-items-center min-w-[20px] h-[28px] text-[#9a9da2] text-[12px] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${btnBase} ${page === item ? btnCurrent : btnIdle}`}
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
          className={`${btnBase} ${btnIdle}`}
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
