import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { useStoredState } from "@/hooks/useStoredState";

export function MealOptions() {
  const [diet, setDiet] = useStoredState("sizzl-diets", [
    "Vegetarian",
    "Vegan",
    "Halal",
    "Kosher",
    "Gluten-free",
    "Dairy-free",
    "Nut-free",
    "Pescatarian",
    "High-protein",
  ]);
  const [cuisine, setCuisine] = useStoredState("sizzl-cuisines", [
    "Italian",
    "Mexican",
    "Asian",
    "Mediterranean",
    "American",
    "Indian",
    "Middle Eastern",
    "British",
  ]);

  const addOption = (setter: Dispatch<SetStateAction<string[]>>) => {
    const value = window.prompt("Enter option name")?.trim();
    if (value)
      setter((current) =>
        current.some((item) => item.toLowerCase() === value.toLowerCase())
          ? current
          : [...current, value],
      );
  };

  return (
    <div className="options-page">
      <section className="option-card">
        <div>
          <h3>Dietary options</h3>
          <button
            type="button"
            className="add pale-green"
            onClick={() => addOption(setDiet)}
          >
            <Plus /> Add
          </button>
        </div>
        <div className="chips">
          {diet.map((x) => (
            <span key={x}>
              {x}
              <button
                type="button"
                aria-label={`Remove ${x}`}
                onClick={() =>
                  setDiet((current) => current.filter((item) => item !== x))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
      <section className="option-card">
        <div>
          <h3>Cuisine types</h3>
          <button
            type="button"
            className="add pale-blue"
            onClick={() => addOption(setCuisine)}
          >
            <Plus /> Add
          </button>
        </div>
        <div className="chips">
          {cuisine.map((x) => (
            <span key={x}>
              {x}
              <button
                type="button"
                aria-label={`Remove ${x}`}
                onClick={() =>
                  setCuisine((current) => current.filter((item) => item !== x))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
export default MealOptions;
