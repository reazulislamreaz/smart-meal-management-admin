import { useSearchParams } from "react-router-dom";
import { avatars } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";

export function DashboardList() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const rows = [
    ["Michael Rahman", "Annual"],
    ["Philips Mark", "Monthly"],
    ["James Dekker", "Trial"],
    ["Eliza H.", "Annual"],
    ["Marco Williams", "Monthly"],
  ].filter((row) => row.join(" ").toLowerCase().includes(query));
  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-4 py-[14px]">
      <h3 className="m-0 mb-[10px] text-[18px]">Recent Users</h3>
      {rows.length ? (
        rows.map((row, i) => (
          <div
            className="min-h-[34px] border-t border-[#edf0f2] flex items-center gap-[9px] text-[12px]"
            key={row[0]}
          >
            <img
              src={avatars[i + 1]}
              alt=""
              className="w-[19px] h-[19px] rounded-full object-cover"
            />
            <span className="flex-1 font-medium flex flex-col gap-[2px]">
              {row[0]}
            </span>
            <small className="rounded-[3px] px-[5px] py-[2px] text-[#2f74e8] bg-[#eaf2ff]">
              {row[1]}
            </small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
export default DashboardList;
