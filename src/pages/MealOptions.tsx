import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useStoredState } from "@/hooks/useStoredState";
import { adminApi } from "@/lib/adminApi";
import { ConfirmModal } from "@/components/common/ConfirmModal";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<"diet" | "cuisine" | null>(null);
  const [newValue, setNewValue] = useState("");

  // Confirm delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    target: "diet" | "cuisine" | null;
    value: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    target: null,
    value: "",
    isLoading: false,
  });

  useEffect(() => {
    let isMounted = true;
    adminApi
      .getMealOptions()
      .then((res) => {
        if (!isMounted || !res) return;
        if (res.diets && res.diets.length > 0) setDiet(res.diets);
        if (res.cuisines && res.cuisines.length > 0) setCuisine(res.cuisines);
      })
      .catch((err) => {
        console.warn("Could not fetch remote meal options, using local defaults:", err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (target: "diet" | "cuisine") => {
    setModalTarget(target);
    setNewValue("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    const trimmed = newValue.trim();
    if (!trimmed || !modalTarget) return;

    const setter = modalTarget === "diet" ? setDiet : setCuisine;
    setter((current) =>
      current.some((item) => item.toLowerCase() === trimmed.toLowerCase())
        ? current
        : [...current, trimmed],
    );

    try {
      await adminApi.addMealOption(modalTarget, trimmed);
    } catch (e) {
      console.warn("Backend addMealOption call handled locally:", e);
    }

    setModalOpen(false);
  };

  const requestRemove = (target: "diet" | "cuisine", itemValue: string) => {
    setDeleteConfirm({
      isOpen: true,
      target,
      value: itemValue,
      isLoading: false,
    });
  };

  const confirmRemove = async () => {
    if (!deleteConfirm.target || !deleteConfirm.value) return;
    const { target, value } = deleteConfirm;

    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));

    const setter = target === "diet" ? setDiet : setCuisine;
    setter((current) => current.filter((item) => item !== value));

    try {
      await adminApi.removeMealOption(target, value);
    } catch (e) {
      console.warn("Backend removeMealOption call handled locally:", e);
    }

    setDeleteConfirm({
      isOpen: false,
      target: null,
      value: "",
      isLoading: false,
    });
  };

  const backdropStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(23, 24, 26, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalCardStyle = {
    background: "#fff",
    border: "1px solid #e5e7ea",
    borderRadius: "8px",
    padding: "20px",
    width: "360px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  };

  return (
    <div className="px-1">
      <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-[18px] py-[15px] mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[16px] m-0 font-bold">Dietary options</h3>
          <button
            type="button"
            className="border-0 rounded-[3px] px-[9px] py-[5px] flex gap-1 items-center text-[12px] [&_svg]:w-[9px] text-[#22a65b] bg-[#e3f9eb] cursor-pointer"
            onClick={() => openModal("diet")}
          >
            <Plus /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-[7px] mt-3">
          {diet.map((x) => (
            <span
              key={x}
              className="px-2 py-[5px] rounded-[12px] text-[#73777c] bg-[#f0f2f4] text-[12px] inline-flex items-center gap-1 transition-[background] duration-150 hover:bg-[#e7e8eb]"
            >
              {x}
              <button
                type="button"
                aria-label={`Remove ${x}`}
                className="border-0 bg-transparent text-[#9a9da2] pl-[2px] text-[12px] leading-none transition-colors duration-150 hover:text-[#ff5361] cursor-pointer"
                onClick={() => requestRemove("diet", x)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
      <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-[18px] py-[15px] mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[16px] m-0 font-bold">Cuisine types</h3>
          <button
            type="button"
            className="border-0 rounded-[3px] px-[9px] py-[5px] flex gap-1 items-center text-[12px] [&_svg]:w-[9px] text-[#3480dc] bg-[#e9f3ff] cursor-pointer"
            onClick={() => openModal("cuisine")}
          >
            <Plus /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-[7px] mt-3">
          {cuisine.map((x) => (
            <span
              key={x}
              className="px-2 py-[5px] rounded-[12px] text-[#73777c] bg-[#f0f2f4] text-[12px] inline-flex items-center gap-1 transition-[background] duration-150 hover:bg-[#e7e8eb]"
            >
              {x}
              <button
                type="button"
                aria-label={`Remove ${x}`}
                className="border-0 bg-transparent text-[#9a9da2] pl-[2px] text-[12px] leading-none transition-colors duration-150 hover:text-[#ff5361] cursor-pointer"
                onClick={() => requestRemove("cuisine", x)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Confirmation Modal for removing dietary options / cuisine ingredients */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={`Remove ${deleteConfirm.target === "diet" ? "Dietary Option" : "Cuisine Type"}`}
        message={`Are you sure you want to remove "${deleteConfirm.value}"? Meal plans and recipe filtering using this option will be affected.`}
        itemName={deleteConfirm.value}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
        onConfirm={confirmRemove}
        onCancel={() =>
          setDeleteConfirm({
            isOpen: false,
            target: null,
            value: "",
            isLoading: false,
          })
        }
      />

      {/* Custom React Modal for adding */}
      {modalOpen && (
        <div style={backdropStyle} onClick={() => setModalOpen(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
              Add {modalTarget === "diet" ? "dietary option" : "cuisine type"}
            </h3>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "11px",
                color: "#686c72",
                width: "100%",
              }}
            >
              Option name
              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={
                  modalTarget === "diet" ? "e.g. Keto, Low-carb" : "e.g. French, Japanese"
                }
                style={{
                  width: "100%",
                  height: "36px",
                  border: "1px solid #d7d9dd",
                  borderRadius: "4px",
                  padding: "0 10px",
                  fontSize: "12px",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="outline-button"
                onClick={() => setModalOpen(false)}
                style={{ padding: "6px 16px", borderRadius: "4px", height: "32px", fontSize: "11px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dark-button"
                onClick={handleSave}
                style={{ padding: "6px 16px", borderRadius: "4px", height: "32px", fontSize: "11px" }}
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default MealOptions;
