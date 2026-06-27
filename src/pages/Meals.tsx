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
      {/* ── Meals toolbar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4 px-4 py-[10px] bg-white border border-[#e5e7ea] rounded-[8px] shadow-[0_1px_4px_rgba(0,0,0,.04)]">
        {/* Left: search + category tabs */}
        <div className="flex items-center gap-[10px] flex-wrap flex-1">
          {/* Search pill */}
          <label className="group inline-flex flex-row items-center gap-2 h-9 px-3 border-[1.5px] border-[#d1d4d9] rounded-[18px] bg-[#f7f8fa] w-[230px] cursor-text transition-[border-color,box-shadow,background] duration-150 focus-within:border-[#17181a] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(23,24,26,.07)]">
            <Search className="w-[14px] h-[14px] text-[#8a8d92] shrink-0 transition-colors duration-150 group-focus-within:text-[#17181a]" />
            <input
              aria-label="Search meals"
              className="flex-1 min-w-0 w-0 h-auto border-0 outline-0 p-0 bg-transparent text-[#27292c] text-[12px] shadow-none placeholder:text-[#9a9da2]"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && clearSearch()}
              placeholder="Search meals…"
            />
            {query && (
              <button
                type="button"
                className="grid place-items-center w-[18px] h-[18px] border-0 rounded-full bg-[#e7e8eb] text-[#555] p-0 cursor-pointer shrink-0 transition-[background,color] duration-130 hover:bg-[#ff5361] hover:text-white [&_svg]:w-[10px] [&_svg]:h-[10px]"
                onClick={clearSearch}
                title="Clear search"
              >
                <X />
              </button>
            )}
          </label>

          {/* Category tabs */}
          <div className="flex gap-1 max-[1100px]:order-3 max-[1100px]:w-full max-[620px]:overflow-x-auto">
            {["All", "Breakfast", "Lunch", "Dinner"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`h-8 px-[14px] border rounded-[16px] text-[12px] transition-[background,color,border-color] duration-150 max-[620px]:flex-none ${category === tab ? "border-[#17181a] text-[#17181a] bg-white font-semibold" : "border-transparent bg-[#f0f1f3] text-[#686c72] font-medium hover:bg-[#e7e8eb] hover:text-[#34363a]"}`}
                onClick={() => setCategory(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/meal-options"
            className="dark-button"
            style={{ height: "34px", fontSize: "11px", padding: "0 16px", display: "inline-flex", alignItems: "center", borderRadius: "6px" }}
          >
            + Add Content
          </Link>
          <button
            type="button"
            className="dark-button"
            style={{ height: "34px", fontSize: "11px", padding: "0 16px", borderRadius: "6px" }}
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
      </div>

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

      <section className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full overflow-x-auto overflow-y-hidden mt-3">
        <table className="[&_td]:h-[39px]">
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
                    className="w-[21px] h-[21px] border border-[#dfe1e4] bg-white rounded-[3px] text-[#777] mr-1 [&_svg]:w-[9px]"
                    onClick={() => editMeal(m)}
                  >
                    <Pencil />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${m[0]}`}
                    className="w-[21px] h-[21px] border border-[#dfe1e4] bg-white rounded-[3px] text-[#ff4d5b] mr-1 [&_svg]:w-[9px]"
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
