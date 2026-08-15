import { useState, useEffect, type FormEvent } from "react";
import { Search, X, Pencil, Trash2, Eye, UtensilsCrossed } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { MealDraft } from "@/types/admin";
import { adminApi, type AdminMealItem } from "@/lib/adminApi";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import MealForm from "@/components/meals/MealForm";
import RecipeDetailModal from "@/components/meals/RecipeDetailModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { TableSkeletonRows } from "@/components/common/Skeleton";

export function Meals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [category, setCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<AdminMealItem | null>(null);

  const [draft, setDraft] = useState<MealDraft>({
    name: "",
    type: "Dinner",
    cuisine: "",
    duration: "",
    price: "",
    servings: 4,
    description: "",
    dietaryTags: [],
    instructions: [],
    ingredients: [],
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [meals, setMeals] = useState<AdminMealItem[]>([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const [loading, setLoading] = useState(true);

  // Confirm delete meal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    meal: AdminMealItem | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    meal: null,
    isLoading: false,
  });

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const fetchMealsData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMeals({
        page,
        limit: pageSize,
        search: debouncedQuery || undefined,
        category: category !== "All" ? category : undefined,
      });

      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const total = res?.meta?.total ?? list.length;
      setMeals(list);
      setTotalMeals(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load master recipes.");
      setMeals([]);
      setTotalMeals(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsData();
  }, [page, debouncedQuery, category]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category]);

  const pageCount = Math.max(1, Math.ceil(totalMeals / pageSize));

  const resetDraft = () => {
    setDraft({
      name: "",
      type: "Dinner",
      cuisine: "",
      duration: "",
      price: "",
      servings: 4,
      description: "",
      dietaryTags: [],
      instructions: [],
      ingredients: [],
      imageUrl: "",
    });
    setEditingMealId(null);
    setError("");
  };

  const handleCreateNew = () => {
    resetDraft();
    setIsFormOpen(true);
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("#meal-name")?.focus();
    }, 0);
  };

  const saveMeal = async (event: FormEvent) => {
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

    try {
      if (editingMealId) {
        await adminApi.updateMeal(editingMealId, draft);
        toast.success(`Recipe "${draft.name}" updated successfully.`);
      } else {
        await adminApi.createMeal(draft);
        toast.success(`Recipe "${draft.name}" added to catalog.`);
      }
      fetchMealsData();
      resetDraft();
      setIsFormOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save recipe.");
    }
  };

  const editMeal = (m: AdminMealItem) => {
    setEditingMealId(m.id);
    setDraft({
      name: m.name,
      type: (m.type as any) || "Dinner",
      cuisine: m.cuisine ?? "American",
      duration: m.duration,
      price: m.price,
      servings: m.servings || 4,
      description: m.description || "",
      dietaryTags: m.dietaryTags || [],
      instructions: m.instructions || [],
      ingredients: m.ingredients || [],
      imageUrl: m.imageUrl || "",
    });
    setError("");
    setIsFormOpen(true);
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("#meal-name")?.focus();
    }, 0);
  };

  const requestDeleteMeal = (m: AdminMealItem) => {
    setDeleteConfirm({
      isOpen: true,
      meal: m,
      isLoading: false,
    });
  };

  const confirmDeleteMeal = async () => {
    if (!deleteConfirm.meal) return;
    const meal = deleteConfirm.meal;

    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));

    try {
      await adminApi.deleteMeal(meal.id);
      toast.success(`Recipe "${meal.name}" deleted.`);
      fetchMealsData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete recipe.");
    } finally {
      setDeleteConfirm({
        isOpen: false,
        meal: null,
        isLoading: false,
      });
    }
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
      {/* Meals toolbar */}
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
                className={`h-8 px-[14px] border rounded-[16px] text-[12px] transition-[background,color,border-color] duration-150 max-[620px]:flex-none cursor-pointer ${category === tab ? "border-[#17181a] text-[#17181a] bg-white font-semibold shadow-xs" : "border-transparent bg-[#f0f1f3] text-[#686c72] font-medium hover:bg-[#e7e8eb] hover:text-[#34363a]"}`}
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
            className="dark-button inline-flex items-center gap-1.5"
            style={{ height: "34px", fontSize: "11px", padding: "0 14px", borderRadius: "6px" }}
          >
            Manage Taxonomies
          </Link>
          <button
            type="button"
            className="dark-button inline-flex items-center gap-1.5 cursor-pointer"
            style={{ height: "34px", fontSize: "11px", padding: "0 14px", borderRadius: "6px" }}
            onClick={handleCreateNew}
          >
            + Add Recipe
          </button>
        </div>
      </div>

      {(isFormOpen || editingMealId !== null) && (
        <MealForm
          draft={draft}
          editing={editingMealId !== null}
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

      <section className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full overflow-x-auto overflow-y-hidden mt-3 shadow-xs">
        <table className="[&_td]:h-[44px]">
          <thead>
            <tr>
              {[
                "MEAL / RECIPE",
                "TYPE",
                "CUISINE",
                "TIME",
                "$/SERVING",
                "STATUS",
                "USES",
                "ACTIONS",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows cols={8} rows={pageSize} />
            ) : meals.length > 0 ? (
              meals.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      {m.imageUrl ? (
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          className="w-8 h-8 rounded-[5px] object-cover border border-[#e5e7ea] shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-[5px] bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] shrink-0">
                          <UtensilsCrossed size={13} />
                        </div>
                      )}
                      <div>
                        <strong className="block text-[#111827] text-[12px]">{m.name}</strong>
                        {m.dietaryTags && m.dietaryTags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {m.dietaryTags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] px-1.5 py-0.2 rounded font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                            {m.dietaryTags.length > 2 && (
                              <span className="text-[9px] text-[#8a8d92] self-center">
                                +{m.dietaryTags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-[#374151] font-medium">{m.type}</span>
                  </td>
                  <td>
                    <span className="text-[#4b5563]">{m.cuisine}</span>
                  </td>
                  <td>
                    <span className="text-[#4b5563]">{m.duration}</span>
                  </td>
                  <td>
                    <strong className="text-[#059669]">{m.price}</strong>
                  </td>
                  <td>
                    <span className={`status ${m.status.toLowerCase()}`}>{m.status}</span>
                  </td>
                  <td>
                    <span className="text-[#6b7280]">{m.uses}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`View ${m.name}`}
                        className="w-[23px] h-[23px] border border-[#dfe1e4] bg-white rounded-[4px] text-[#555] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer flex items-center justify-center [&_svg]:w-[11px] [&_svg]:h-[11px]"
                        onClick={() => setSelectedMealForDetail(m)}
                        title="View Recipe Details"
                      >
                        <Eye />
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${m.name}`}
                        className="w-[23px] h-[23px] border border-[#dfe1e4] bg-white rounded-[4px] text-[#555] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer flex items-center justify-center [&_svg]:w-[11px] [&_svg]:h-[11px]"
                        onClick={() => editMeal(m)}
                        title="Edit Recipe"
                      >
                        <Pencil />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${m.name}`}
                        className="w-[23px] h-[23px] border border-[#dfe1e4] bg-white rounded-[4px] text-[#ff4d5b] hover:bg-[#fee2e2] cursor-pointer flex items-center justify-center [&_svg]:w-[11px] [&_svg]:h-[11px]"
                        onClick={() => requestDeleteMeal(m)}
                        title="Delete Recipe"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <EmptyState label="No recipes found matching criteria" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalMeals > pageSize && (
          <Pagination
            page={page}
            pageCount={pageCount}
            totalItems={totalMeals}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </section>

      {/* View Recipe Intelligence Modal */}
      <RecipeDetailModal
        isOpen={!!selectedMealForDetail}
        onClose={() => setSelectedMealForDetail(null)}
        meal={selectedMealForDetail}
        onEdit={(meal) => {
          setSelectedMealForDetail(null);
          editMeal(meal);
        }}
      />

      {/* Confirmation Modal for deleting meal / recipe */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${deleteConfirm.meal?.name}"? This recipe will be removed permanently from the master catalog.`}
        itemName={deleteConfirm.meal?.name}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
        onConfirm={confirmDeleteMeal}
        onCancel={() =>
          setDeleteConfirm({
            isOpen: false,
            meal: null,
            isLoading: false,
          })
        }
      />
    </>
  );
}

export default Meals;
