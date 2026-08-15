import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rounded",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "rounded"
        ? "rounded-[6px]"
        : variant === "text"
          ? "rounded-[3px]"
          : "rounded-none";

  return (
    <div
      className={`relative overflow-hidden bg-[#e9ebed] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.6)] before:to-transparent ${variantClass} ${className}`}
      style={{
        width: width !== undefined ? width : "100%",
        height: height !== undefined ? height : variant === "text" ? "14px" : "20px",
        ...style,
      }}
      {...props}
    />
  );
}

export function TableSkeletonRows({
  cols = 7,
  rows = 5,
}: {
  cols?: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx}>
              <Skeleton height={cIdx === 1 ? 22 : 14} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default Skeleton;
