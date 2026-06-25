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
    <section className="panel compact-list">
      <h3>Top Meals</h3>
      {filteredMeals.length ? (
        filteredMeals.map((meal) => (
          <div className="meal-row" key={meal[0]}>
            <span>–</span>
            <strong>{meal[0]}</strong>
            <small>{meal[4]}</small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
export default TopMeals;
