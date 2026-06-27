import { useSearchParams } from "react-router-dom";
import { meals } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";

export function TopMeals() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const filteredMeals = meals
    .slice(0, 5)
    .filter((meal) => meal.join(" ").toLowerCase().includes(query));
  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-4 py-[14px]">
      <h3 className="m-0 mb-[10px] text-[18px]">Top Meals</h3>
      {filteredMeals.length ? (
        filteredMeals.map((meal) => (
          <div
            className="min-h-[34px] border-t border-[#edf0f2] flex items-center gap-[9px] text-[12px]"
            key={meal[0]}
          >
            <span>–</span>
            <strong className="flex-1 font-medium flex flex-col gap-[2px]">
              {meal[0]}
            </strong>
            <small className="text-[#555]">{meal[4]}</small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
export default TopMeals;
