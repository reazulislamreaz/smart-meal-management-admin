import type { FormEvent } from "react";
import type { MealDraft } from "@/types/admin";

export function MealForm({
  draft,
  editing,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  draft: MealDraft;
  editing: boolean;
  error: string;
  onChange: (field: keyof MealDraft, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="bg-white border border-[#e5e7ea] rounded-[7px] p-[14px]"
      onSubmit={onSubmit}
      style={{ position: "relative", padding: "20px", marginBottom: "16px" }}
    >
      <button
        type="button"
        onClick={onCancel}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "transparent",
          border: 0,
          cursor: "pointer",
          color: "#8a8d92",
          fontSize: "18px",
          fontWeight: "bold",
        }}
        aria-label="Close"
      >
        ×
      </button>

      <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
        {editing ? "Edit meal" : "Add new meal"}
      </h3>

      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 mb-[10px] max-[620px]:grid-cols-2 max-[420px]:grid-cols-1">
        <label>
          NAME
          <input
            id="meal-name"
            value={draft.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. Shakshuka"
            required
          />
        </label>
        <label>
          TYPE
          <select
            value={draft.type}
            onChange={(event) => onChange("type", event.target.value)}
          >
            <option>Dinner</option>
            <option>Lunch</option>
            <option>Breakfast</option>
          </select>
        </label>
        <label>
          CUISINE
          <input
            value={draft.cuisine}
            onChange={(event) => onChange("cuisine", event.target.value)}
            placeholder="e.g. British"
            required
          />
        </label>
        <label>
          TIME
          <input
            value={draft.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            placeholder="25m"
            required
          />
        </label>
        <label>
          $/SERVING
          <input
            value={draft.price}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="e.g. 5.50"
            required
          />
        </label>
      </div>

      {error && (
        <p
          className="m-0 text-[#ff5361] text-[11px] leading-[1.4]"
          role="alert"
          style={{ marginTop: "12px", marginBottom: "12px" }}
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-2 mt-1" style={{ marginTop: "16px" }}>
        <button className="dark-button" type="submit" style={{ height: "32px", fontSize: "11px", padding: "0 16px" }}>
          {editing ? "Update meal" : "Save meal"}
        </button>
      </div>
    </form>
  );
}
export default MealForm;
