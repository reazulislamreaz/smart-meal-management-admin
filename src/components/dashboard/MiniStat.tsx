import type { ReactNode } from "react";

export function MiniStat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="relative min-h-[128px] p-5 bg-white border border-[#e8eaed] rounded-[6px] flex items-center gap-[14px] max-[620px]:min-h-[118px]">
      <div className="absolute left-[15px] top-[14px] w-[29px] h-[29px] rounded-[4px] bg-[#17181a] text-white grid place-items-center [&_svg]:w-[15px]">
        {icon}
      </div>
      <div className="mt-[28px] flex flex-col gap-1.5">
        <strong className="text-[24px] tracking-[-1px]">{value}</strong>
        <span className="text-[#777b81] text-[16px]">{label}</span>
      </div>
      <em className="absolute right-[13px] bottom-[13px] bg-[#ddfbe8] text-[#1bbd61] rounded-[3px] not-italic text-[9px] px-[6px] py-[3px]">
        +20%
      </em>
    </div>
  );
}
export default MiniStat;
