import { useSearchParams } from "react-router-dom";
import { meals as defaultMeals } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";

export interface TopMealItem {
  id?: string;
  title: string;
  price: string;
  uses?: string;
}

export function TopMeals({ meals }: { meals?: TopMealItem[] }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const defaultTopMeals: TopMealItem[] = defaultMeals.slice(0, 5).map((m) => ({
    title: m[0],
    price: m[4],
    uses: m[6],
  }));

  const sourceMeals = meals !== undefined && meals.length > 0 ? meals : defaultTopMeals;

  const filteredMeals = sourceMeals.filter((meal) =>
    `${meal.title} ${meal.price}`.toLowerCase().includes(query),
  );

  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-4 py-[14px]">
      <h3 className="m-0 mb-[10px] text-[18px]">Top Meals</h3>
      {filteredMeals.length ? (
        filteredMeals.map((meal, idx) => (
          <div
            className="min-h-[34px] border-t border-[#edf0f2] flex items-center gap-[9px] text-[12px]"
            key={meal.title + idx}
          >
            <span>–</span>
            <strong className="flex-1 font-medium flex flex-col gap-[2px]">
              {meal.title}
            </strong>
            <small className="text-[#555]">{meal.price}</small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
export default TopMeals;
