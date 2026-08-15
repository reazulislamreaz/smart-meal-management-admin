import React, { useState } from "react";
import { X, Plus, Trash2, Tag, ListOrdered, ChefHat } from "lucide-react";
import type { MealDraft, MealIngredientDraft } from "@/types/admin";
import ImageUploadDropzone from "@/components/common/ImageUploadDropzone";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "High Protein",
  "Pescatarian",
  "Keto",
  "Low Carb",
];

const INGREDIENT_DEPARTMENTS = [
  "Produce",
  "Meat & Fish",
  "Dairy",
  "Pantry Staples",
  "Frozen",
  "Bakery",
  "Beverages",
  "Canned Goods",
];

const COMMON_UNITS = ["g", "kg", "ml", "L", "tbsp", "tsp", "cups", "pcs", "oz", "lbs", "pinch"];

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
  onChange: (field: keyof MealDraft, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}) {
  // Local ingredient draft for the quick-add row
  const [ingName, setIngName] = useState("");
  const [ingQty, setIngQty] = useState<string>("1");
  const [ingUnit, setIngUnit] = useState("pcs");
  const [ingDept, setIngDept] = useState("Produce");

  // Local instruction draft for the quick-add step
  const [stepDraft, setStepDraft] = useState("");

  const ingredients: MealIngredientDraft[] = Array.isArray(draft.ingredients)
    ? draft.ingredients
    : [];
  const instructions: string[] = Array.isArray(draft.instructions)
    ? draft.instructions
    : [];
  const dietaryTags: string[] = Array.isArray(draft.dietaryTags)
    ? draft.dietaryTags
    : [];

  const handleAddIngredient = () => {
    if (!ingName.trim()) return;
    const newIngredient: MealIngredientDraft = {
      name: ingName.trim(),
      quantity: parseFloat(ingQty) || 1,
      unit: ingUnit,
      category: ingDept,
    };
    onChange("ingredients", [...ingredients, newIngredient]);
    setIngName("");
    setIngQty("1");
  };

  const handleRemoveIngredient = (index: number) => {
    onChange(
      "ingredients",
      ingredients.filter((_, idx) => idx !== index),
    );
  };

  const handleAddInstruction = () => {
    if (!stepDraft.trim()) return;
    onChange("instructions", [...instructions, stepDraft.trim()]);
    setStepDraft("");
  };

  const handleRemoveInstruction = (index: number) => {
    onChange(
      "instructions",
      instructions.filter((_, idx) => idx !== index),
    );
  };

  const toggleDietaryTag = (tag: string) => {
    if (dietaryTags.includes(tag)) {
      onChange(
        "dietaryTags",
        dietaryTags.filter((t) => t !== tag),
      );
    } else {
      onChange("dietaryTags", [...dietaryTags, tag]);
    }
  };

  return (
    <form
      className="bg-white border border-[#e5e7ea] rounded-[10px] p-6 mb-6 shadow-sm animate-[fadeIn_.2s_ease]"
      onSubmit={onSubmit}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#f0f1f3]">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-[#17181a]" />
          <h3 className="m-0 text-[15px] font-bold text-[#17181a]">
            {editing ? "Edit Master Recipe & Intelligence" : "Create Master Recipe"}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#8a8d92] hover:text-[#17181a] cursor-pointer p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-[#ffe5e8] border border-[#ffb3b8] text-[#e5484d] rounded-[6px] text-[11px]">
          {error}
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-[12px]">
        {/* Left Column: Metadata & Photo */}
        <div className="flex flex-col gap-3.5">
          {/* Image Upload Dropzone */}
          <ImageUploadDropzone
            value={draft.imageUrl}
            onChange={(url) => onChange("imageUrl", url)}
            label="Recipe Photography (AWS S3 Upload)"
          />

          <div>
            <label className="text-[#52565b] font-medium mb-1">
              Recipe Name *
            </label>
            <input
              id="meal-name"
              value={draft.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Chicken Caesar Wraps, Shakshuka"
              className="w-full h-9 px-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Meal Category
              </label>
              <select
                value={draft.type}
                onChange={(e) => onChange("type", e.target.value)}
                className="w-full h-9 px-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none bg-white cursor-pointer"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Cuisine Type *
              </label>
              <input
                value={draft.cuisine}
                onChange={(e) => onChange("cuisine", e.target.value)}
                placeholder="e.g. Italian, Mediterranean, Asian"
                className="w-full h-9 px-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Prep Time *
              </label>
              <input
                value={draft.duration}
                onChange={(e) => onChange("duration", e.target.value)}
                placeholder="e.g. 25m"
                className="w-full h-9 px-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Cost / Serving *
              </label>
              <input
                value={draft.price}
                onChange={(e) => onChange("price", e.target.value)}
                placeholder="e.g. 5.50"
                className="w-full h-9 px-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Servings Yield
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={draft.servings || 4}
                onChange={(e) => onChange("servings", Number(e.target.value))}
                className="w-full h-9 px-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[#52565b] font-medium mb-1">
              Recipe Description & Overview
            </label>
            <textarea
              rows={2}
              value={draft.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Brief summary of dish characteristics, flavor profile, and macros..."
              className="w-full p-2.5 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none resize-y"
            />
          </div>
        </div>

        {/* Right Column: Recipe Intelligence Builders */}
        <div className="flex flex-col gap-4">
          {/* 1. Dietary Tags */}
          <div>
            <label className="text-[#52565b] font-medium mb-1.5 flex items-center gap-1.5">
              <Tag size={13} />
              Dietary Restrictions & Taxonomies
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-[#f8f9fa] border border-[#e5e7ea] rounded-[7px] max-h-[90px] overflow-y-auto">
              {DIETARY_OPTIONS.map((tag) => {
                const isSelected = dietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-[14px] transition-colors cursor-pointer ${isSelected ? "bg-[#17181a] text-white" : "bg-white text-[#52565b] border border-[#d1d4d9] hover:border-[#17181a]"}`}
                  >
                    {isSelected && "✓ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Structured Ingredients Matrix */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#52565b] font-medium m-0">
                Ingredients Matrix ({ingredients.length})
              </label>
              <span className="text-[10px] text-[#8a8d92]">
                Used for auto-deduction against pantry stock
              </span>
            </div>

            {/* Quick add row */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-1.5 mb-2">
              <input
                type="text"
                value={ingName}
                onChange={(e) => setIngName(e.target.value)}
                placeholder="Ingredient name (e.g. Eggs)"
                className="h-8 px-2 text-[11px] border border-[#d1d4d9] rounded-[4px] outline-none focus:border-[#17181a]"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIngredient())}
              />
              <input
                type="number"
                step="any"
                value={ingQty}
                onChange={(e) => setIngQty(e.target.value)}
                placeholder="Qty"
                className="h-8 px-2 text-[11px] border border-[#d1d4d9] rounded-[4px] outline-none focus:border-[#17181a]"
              />
              <select
                value={ingUnit}
                onChange={(e) => setIngUnit(e.target.value)}
                className="h-8 px-1 text-[11px] border border-[#d1d4d9] rounded-[4px] outline-none bg-white cursor-pointer"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <select
                value={ingDept}
                onChange={(e) => setIngDept(e.target.value)}
                className="h-8 px-1 text-[10px] border border-[#d1d4d9] rounded-[4px] outline-none bg-white cursor-pointer"
              >
                {INGREDIENT_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="h-8 px-2.5 bg-[#17181a] text-white text-[11px] font-bold rounded-[4px] hover:bg-[#2e3035] transition-colors cursor-pointer flex items-center justify-center"
                title="Add Ingredient"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* List */}
            <div className="border border-[#e5e7ea] rounded-[6px] overflow-hidden max-h-[120px] overflow-y-auto">
              {ingredients.length > 0 ? (
                <div className="divide-y divide-[#f0f1f3]">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2.5 py-1 text-[11px] bg-white hover:bg-[#fafbfc]"
                    >
                      <div className="flex items-center gap-2">
                        <strong className="text-[#111827]">{ing.name}</strong>
                        <span className="text-[#6b7280]">
                          {ing.quantity} {ing.unit}
                        </span>
                        <span className="text-[9px] bg-[#f0f1f3] px-1.5 py-0.5 rounded text-[#52565b]">
                          {ing.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-[#9ca3af] hover:text-[#ef4444] p-0.5 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-center text-[#9ca3af] text-[11px]">
                  No ingredients added yet.
                </div>
              )}
            </div>
          </div>

          {/* 3. Step-by-Step Cooking Instructions */}
          <div>
            <label className="text-[#52565b] font-medium mb-1.5 flex items-center gap-1.5">
              <ListOrdered size={13} />
              Cooking Instructions Sequence ({instructions.length})
            </label>

            {/* Step add row */}
            <div className="flex gap-1.5 mb-2">
              <input
                type="text"
                value={stepDraft}
                onChange={(e) => setStepDraft(e.target.value)}
                placeholder="e.g. Heat olive oil in skillet over medium heat..."
                className="flex-1 h-8 px-2.5 text-[11px] border border-[#d1d4d9] rounded-[4px] outline-none focus:border-[#17181a]"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInstruction())}
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="h-8 px-3 bg-[#17181a] text-white text-[11px] font-bold rounded-[4px] hover:bg-[#2e3035] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Add Step</span>
              </button>
            </div>

            {/* Instructions List */}
            <div className="border border-[#e5e7ea] rounded-[6px] overflow-hidden max-h-[110px] overflow-y-auto">
              {instructions.length > 0 ? (
                <div className="divide-y divide-[#f0f1f3]">
                  {instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 px-2.5 py-1 text-[11px] bg-white hover:bg-[#fafbfc]"
                    >
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-[#17181a] text-[10px] min-w-[14px]">
                          {idx + 1}.
                        </span>
                        <span className="text-[#374151] leading-tight">{step}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(idx)}
                        className="text-[#9ca3af] hover:text-[#ef4444] p-0.5 cursor-pointer shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-center text-[#9ca3af] text-[11px]">
                  No preparation steps added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 mt-6 border-t border-[#f0f1f3]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[#d0d3d8] rounded-[6px] bg-white text-[#34363a] font-semibold text-[12px] hover:bg-[#f7f8fa] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-[#17181a] text-white font-semibold text-[12px] rounded-[6px] hover:bg-[#2e3035] transition-colors cursor-pointer"
        >
          {editing ? "Update Master Recipe" : "Save Recipe to Catalog"}
        </button>
      </div>
    </form>
  );
}

export default MealForm;
