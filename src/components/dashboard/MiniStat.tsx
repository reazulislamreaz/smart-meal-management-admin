import type { ReactNode } from "react";

export function MiniStat({
  icon,
  value,
  label,
  money,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  money?: boolean;
}) {
  return (
    <div className="mini-stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong className={money ? "money" : ""}>{value}</strong>
        <span>{label}</span>
      </div>
      <em>+20%</em>
    </div>
  );
}
export default MiniStat;
