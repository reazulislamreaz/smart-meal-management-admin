import { useState, useEffect, type FormEvent } from "react";
import { Search, X, Pencil, Trash2 } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { meals as initialMealsData } from "@/data/adminData";
import type { MealDraft } from "@/types/admin";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import MealForm from "@/components/meals/MealForm";

export function Meals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [mealRows, setMealRows] = useStoredState(
    "sizzl-meals",
    initialMealsData.map((meal) => [...meal]),
  );
  const [category, setCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<MealDraft>({
    name: "",
    type: "Dinner",
    cuisine: "",
    duration: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredMeals = mealRows.filter((meal) => {
    const matchesQuery = meal
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (category === "All" || meal[1] === category);
  });

  const pageCount = Math.max(1, Math.ceil(filteredMeals.length / pageSize));
  const visibleMeals = filteredMeals.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => setPage(1), [query, category]);

  const resetDraft = () => {
    setDraft({ name: "", type: "Dinner", cuisine: "", duration: "", price: "" });
    setEditingIndex(null);
    setError("");
  };

  const saveMeal = (event: FormEvent) => {
    event.preventDefault();
    if (
      !draft.name.trim() ||
      !draft.cuisine.trim() ||
      !draft.duration.trim() ||
      !/^\$?\d+(\.\d{1,2})?$/.test(draft.price.trim())
    ) {
      setError("Enter a meal name, cuisine, duration, and a valid price.");
      return;
    }
    const price = draft.price.startsWith("$") ? draft.price : `$${draft.price}`;
    const row = [
      draft.name.trim(),
      draft.type,
      draft.cuisine.trim(),
      draft.duration.trim(),
      price,
      editingIndex !== null ? (mealRows[editingIndex][5] ?? "Active") : "Active",
      editingIndex !== null ? (mealRows[editingIndex][6] ?? "0") : "0",
    ];
    setMealRows((current) =>
      editingIndex === null
        ? [row, ...current]
        : current.map((meal, index) => (index === editingIndex ? row : meal)),
    );
    resetDraft();
    setIsFormOpen(false);
  };

  const editMeal = (meal: string[]) => {
    const index = mealRows.indexOf(meal);
    setEditingIndex(index);
    setDraft({
      name: meal[0],
      type: meal[1],
      cuisine: meal[2] ?? "American",
      duration: meal[3],
      price: meal[4],
    });
    setError("");
    setIsFormOpen(true);
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("#meal-name")?.focus();
    }, 0);
  };

  const handleSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set("q", val);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <section
        className="meal-search-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label className="searchbox small">
            <Search />
            <input
              aria-label="Search meals"
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && clearSearch()}
              placeholder="Search meals..."
            />
            {query && (
              <button
                className="search-clear"
                onClick={clearSearch}
                type="button"
              >
                <X />
              </button>
            )}
          </label>
          <div className="meal-tabs">
            {["All", "Breakfast", "Lunch", "Dinner"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={category === tab ? "active" : ""}
                onClick={() => setCategory(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Link to="/meal-options" className="dark-button" style={{ height: "32px", fontSize: "11px", padding: "0 14px", display: "inline-flex", alignItems: "center" }}>
            + Add Content
          </Link>
          <button
            type="button"
            className="dark-button"
            style={{ height: "32px", fontSize: "11px", padding: "0 14px" }}
            onClick={() => {
              setIsFormOpen(true);
              window.setTimeout(() => {
                document.querySelector<HTMLInputElement>("#meal-name")?.focus();
              }, 0);
            }}
          >
            + Add Meal
          </button>
        </div>
      </section>

      {(isFormOpen || editingIndex !== null) && (
        <MealForm
          draft={draft}
          editing={editingIndex !== null}
          error={error}
          onChange={(field, value) =>
            setDraft((current) => ({ ...current, [field]: value }))
          }
          onSubmit={saveMeal}
          onCancel={() => {
            resetDraft();
            setIsFormOpen(false);
          }}
        />
      )}

      <section className="table-panel meal-table">
        <table>
          <thead>
            <tr>
              {[
                "MEAL",
                "TYPE",
                "CUISINE",
                "TIME",
                "$/SERVING",
                "STATUS",
                "USES",
                "",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleMeals.map((m) => (
              <tr key={m[0]}>
                {m.map((v, i) => (
                  <td key={i}>
                    {i === 5 ? (
                      <span className={`status ${v.toLowerCase()}`}>{v}</span>
                    ) : i === 0 || i === 4 ? (
                      <strong>{v}</strong>
                    ) : (
                      v
                    )}
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    aria-label={`Edit ${m[0]}`}
                    className="tiny-action"
                    onClick={() => editMeal(m)}
                  >
                    <Pencil />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${m[0]}`}
                    className="tiny-action delete"
                    onClick={() =>
                      setMealRows((current) =>
                        current.filter((meal) => meal !== m),
                      )
                    }
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            {!filteredMeals.length && (
              <tr>
                <td colSpan={8}>
                  <EmptyState label="No meals found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          pageCount={pageCount}
          totalItems={filteredMeals.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
export default Meals;
