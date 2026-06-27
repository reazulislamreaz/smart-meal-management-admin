import { useState } from "react";

export function BarChart({ title = "User ratio" }: { title?: string }) {
  const [period, setPeriod] = useState<"monthly" | "annually">("annually");
  const bars =
    period === "annually"
      ? [46, 58, 86, 61, 45, 61, 34, 43, 55, 71, 36, 53]
      : [40, 53, 72, 56, 63, 48, 67, 58, 45, 64, 51, 69];
  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] min-w-0 mt-[15px] pt-[15px] px-[14px] pb-[10px] overflow-x-auto">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-[18px]">{title}</h3>
        <div>
          <button
            type="button"
            className={`border px-[11px] py-1 text-[12px] rounded-[12px] ml-[5px] ${period === "monthly" ? "bg-[#191a1c] text-white border-[#191a1c]" : "border-[#bfc3c8] bg-white"}`}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`border px-[11px] py-1 text-[12px] rounded-[12px] ml-[5px] ${period === "annually" ? "bg-[#191a1c] text-white border-[#191a1c]" : "border-[#bfc3c8] bg-white"}`}
            onClick={() => setPeriod("annually")}
          >
            Annually
          </button>
        </div>
      </div>
      <div className="h-[250px] mt-3 flex border-b border-[#eef0f2] bg-[repeating-linear-gradient(to_bottom,#fff_0,#fff_48px,#eef0f2_49px)] max-[900px]:min-w-[620px]">
        <div className="w-[28px] flex flex-col justify-between text-[#909398] text-[12px] pb-5">
          <span>250</span>
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="flex-1 flex items-end justify-around px-1">
          {bars.map((height, i) => (
            <div
              className="w-[5.5%] h-full flex flex-col justify-end items-center gap-[7px]"
              key={i}
            >
              <div
                className={`relative w-[25px] min-h-[4px] rounded-t-[5px] ${i === 2 ? "bg-[repeating-linear-gradient(135deg,#111_0,#111_2px,#4a4a4a_2px,#4a4a4a_4px)]" : "bg-[repeating-linear-gradient(135deg,#c9ccd0_0,#c9ccd0_2px,#e4e6e8_2px,#e4e6e8_4px)]"}`}
                style={{ height: `${height}%` }}
              >
                {i === 2 && (
                  <b className="absolute top-[-24px] left-1/2 -translate-x-1/2 bg-[#151618] text-white px-[7px] py-1 rounded-[4px] text-[12px]">
                    220
                  </b>
                )}
              </div>
              <span className="text-[#777] text-[12px] h-[13px]">
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
