import type { FormEvent } from "react";
import { Link } from "react-router-dom";
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
    <form className="meal-form panel" onSubmit={onSubmit}>
      <div className="meal-form-top">
        <Link to="/meal-options" className="dark-button">
          + Add Content
        </Link>
        <button
          type="button"
          className="dark-button"
          onClick={() =>
            document.querySelector<HTMLInputElement>("#meal-name")?.focus()
          }
        >
          + Add Meal
        </button>
      </div>
      <h3>{editing ? "Edit meal" : "Add new meal"}</h3>
      <div className="meal-inputs">
        <label>
          Name
          <input
            id="meal-name"
            value={draft.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. Shakshuka"
            required
          />
        </label>
        <label>
          Type
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
          Duration
          <input
            value={draft.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            placeholder="25m"
            required
          />
        </label>
        <label>
          Price
          <input
            value={draft.price}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="e.g. $5.50"
            required
          />
        </label>
      </div>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button className="dark-button" type="submit">
          {editing ? "Update meal" : "Save meal"}
        </button>
        {editing && (
          <button className="outline-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
export default MealForm;
