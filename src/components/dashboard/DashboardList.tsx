import { useSearchParams } from "react-router-dom";
import { avatars } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";

export interface DashboardUserItem {
  id?: string;
  name: string;
  plan: string;
  avatar?: string;
}

export function DashboardList({ users }: { users?: DashboardUserItem[] }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const defaultRows: DashboardUserItem[] = [
    { name: "Michael Rahman", plan: "Annual", avatar: avatars[1] },
    { name: "Philips Mark", plan: "Monthly", avatar: avatars[2] },
    { name: "James Dekker", plan: "Trial", avatar: avatars[3] },
    { name: "Eliza H.", plan: "Annual", avatar: avatars[4] },
    { name: "Marco Williams", plan: "Monthly", avatar: avatars[5] },
  ];

  const sourceRows = users && users.length > 0 ? users : defaultRows;

  const rows = sourceRows.filter((row) =>
    `${row.name} ${row.plan}`.toLowerCase().includes(query),
  );

  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-4 py-[14px]">
      <h3 className="m-0 mb-[10px] text-[18px]">Recent Users</h3>
      {rows.length ? (
        rows.map((row, i) => (
          <div
            className="min-h-[34px] border-t border-[#edf0f2] flex items-center gap-[9px] text-[12px]"
            key={row.name + i}
          >
            <img
              src={row.avatar || avatars[(i + 1) % avatars.length]}
              alt=""
              className="w-[19px] h-[19px] rounded-full object-cover"
            />
            <span className="flex-1 font-medium flex flex-col gap-[2px]">
              {row.name}
            </span>
            <small className="rounded-[3px] px-[5px] py-[2px] text-[#2f74e8] bg-[#eaf2ff]">
              {row.plan}
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
