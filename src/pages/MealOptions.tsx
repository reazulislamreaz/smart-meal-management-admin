import { useState } from "react";
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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<"diet" | "cuisine" | null>(null);
  const [newValue, setNewValue] = useState("");

  const openModal = (target: "diet" | "cuisine") => {
    setModalTarget(target);
    setNewValue("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const setter = modalTarget === "diet" ? setDiet : setCuisine;
    setter((current) =>
      current.some((item) => item.toLowerCase() === trimmed.toLowerCase())
        ? current
        : [...current, trimmed],
    );
    setModalOpen(false);
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
    <div className="options-page">
      <section className="option-card">
        <div>
          <h3>Dietary options</h3>
          <button
            type="button"
            className="add pale-green"
            onClick={() => openModal("diet")}
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
            onClick={() => openModal("cuisine")}
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

      {/* Custom React Modal */}
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
