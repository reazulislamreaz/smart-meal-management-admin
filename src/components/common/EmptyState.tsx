export function EmptyState({ label = "No results found" }: { label?: string }) {
  return (
    <div className="px-[14px] py-[28px] text-center text-[#8a8d92] text-[12px]">
      {label}
    </div>
  );
}
export default EmptyState;
