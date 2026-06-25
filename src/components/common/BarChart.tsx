import { useState } from "react";

export function BarChart({ title = "User ratio" }: { title?: string }) {
  const [period, setPeriod] = useState<"monthly" | "annually">("annually");
  const bars =
    period === "annually"
      ? [46, 58, 86, 61, 45, 61, 34, 43, 55, 71, 36, 53]
      : [40, 53, 72, 56, 63, 48, 67, 58, 45, 64, 51, 69];
  return (
    <section className="chart-card">
      <div className="chart-head">
        <h3>{title}</h3>
        <div>
          <button
            type="button"
            className={period === "monthly" ? "selected" : ""}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={period === "annually" ? "selected" : ""}
            onClick={() => setPeriod("annually")}
          >
            Annually
          </button>
        </div>
      </div>
      <div className="chart">
        <div className="y-labels">
          <span>250</span>
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="bars">
          {bars.map((height, i) => (
            <div className="bar-column" key={i}>
              <div
                className={`bar ${i === 2 ? "focus" : ""}`}
                style={{ height: `${height}%` }}
              >
                {i === 2 && <b>220</b>}
              </div>
              <span>
                {
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default BarChart;
