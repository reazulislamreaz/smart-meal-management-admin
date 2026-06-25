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
    <section className="panel compact-list">
      <h3>Recent Users</h3>
      {rows.length ? (
        rows.map((row, i) => (
          <div className="person-row" key={row[0]}>
            <img src={avatars[i + 1]} alt="" />
            <span>{row[0]}</span>
            <small>{row[1]}</small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
export default DashboardList;
