import { X, Clock, Users, Utensils, Tag, ChefHat } from "lucide-react";
import type { AdminMealItem } from "@/lib/adminApi";

export interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: AdminMealItem | null;
  onEdit?: (meal: AdminMealItem) => void;
}

export function RecipeDetailModal({
  isOpen,
  onClose,
  meal,
  onEdit,
}: RecipeDetailModalProps) {
  if (!isOpen || !meal) return null;

  const dietaryTags = Array.isArray(meal.dietaryTags) ? meal.dietaryTags : [];
  const instructions = Array.isArray(meal.instructions)
    ? meal.instructions
    : [];
  const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,24,26,0.45)] backdrop-blur-xs p-4 animate-[fadeIn_.15s_ease]">
      <div className="bg-white border border-[#e5e7ea] rounded-[10px] shadow-[0_20px_48px_rgba(0,0,0,0.18)] w-full max-w-[680px] max-h-[90vh] flex flex-col overflow-hidden animate-[scaleIn_.2s_ease]">
        {/* Modal Header & Hero Image */}
        <div className="relative bg-[#17181a] text-white">
          {meal.imageUrl ? (
            <div className="relative h-[160px] w-full overflow-hidden">
              <img
                src={meal.imageUrl}
                alt={meal.name}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17181a] via-[rgba(23,24,26,0.4)] to-transparent" />
            </div>
          ) : (
            <div className="h-[90px] w-full bg-[#1e2023] flex items-center px-6">
              <ChefHat className="w-8 h-8 text-[#9ca3af] opacity-50" />
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[rgba(0,0,0,0.5)] text-white hover:bg-black flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>

          {/* Title & Type overlay */}
          <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between flex-wrap gap-2">
            <div>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#374151] text-[#f3f4f6] text-[10px] font-bold uppercase tracking-wider">
                {meal.type} · {meal.cuisine}
              </span>
              <h2 className="m-0 mt-1 text-[18px] font-bold text-white">
                {meal.name}
              </h2>
            </div>

            <span
              className={`px-2.5 py-1 text-[11px] font-bold rounded-[14px] ${meal.status === "Active" ? "bg-[#10b981] text-white" : "bg-[#f59e0b] text-white"}`}
            >
              {meal.status}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-[12px]">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-3 bg-[#f8f9fa] border border-[#eceef0] rounded-[8px] p-3 text-center">
            <div>
              <span className="text-[10px] text-[#71757b] uppercase font-semibold block">
                Prep Time
              </span>
              <strong className="text-[13px] text-[#111827] flex items-center justify-center gap-1 mt-0.5">
                <Clock size={13} className="text-[#8a8d92]" />
                {meal.duration}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-[#71757b] uppercase font-semibold block">
                Est. Cost
              </span>
              <strong className="text-[13px] text-[#059669] flex items-center justify-center gap-0.5 mt-0.5">
                {meal.price}
                <span className="text-[10px] font-normal text-[#6b7280]">
                  /srv
                </span>
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-[#71757b] uppercase font-semibold block">
                Servings
              </span>
              <strong className="text-[13px] text-[#111827] flex items-center justify-center gap-1 mt-0.5">
                <Users size={13} className="text-[#8a8d92]" />
                {meal.servings || 4}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-[#71757b] uppercase font-semibold block">
                Cooked Logs
              </span>
              <strong className="text-[13px] text-[#111827] flex items-center justify-center gap-1 mt-0.5">
                <Utensils size={13} className="text-[#8a8d92]" />
                {meal.uses}
              </strong>
            </div>
          </div>

          {/* Description */}
          {meal.description && (
            <div>
              <h4 className="m-0 text-[12px] font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Recipe Overview
              </h4>
              <p className="m-0 text-[#4b5563] text-[12px] leading-relaxed">
                {meal.description}
              </p>
            </div>
          )}

          {/* Dietary Restrictions */}
          {dietaryTags.length > 0 && (
            <div>
              <h4 className="m-0 text-[12px] font-bold text-[#111827] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={13} />
                Dietary & Allergen Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] rounded-[13px] text-[11px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients Matrix */}
          <div>
            <h4 className="m-0 text-[12px] font-bold text-[#111827] mb-2 uppercase tracking-wider flex items-center justify-between">
              <span>Required Ingredients ({ingredients.length})</span>
              <span className="text-[10px] font-normal text-[#8a8d92] lowercase">
                auto-deducted from user pantry
              </span>
            </h4>

            {ingredients.length > 0 ? (
              <div className="border border-[#e5e7ea] rounded-[7px] overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr] bg-[#f8f9fa] px-3 py-1.5 text-[10px] font-bold text-[#71757b] uppercase border-b border-[#e5e7ea]">
                  <span>Ingredient</span>
                  <span>Amount & Unit</span>
                  <span>Department</span>
                </div>
                <div className="divide-y divide-[#f0f1f3] max-h-[160px] overflow-y-auto">
                  {ingredients.map((ing: any, idx: number) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[2fr_1fr_1fr] px-3 py-1.5 text-[11px] items-center"
                    >
                      <strong className="text-[#111827]">
                        {ing.name || ing}
                      </strong>
                      <span className="text-[#4b5563]">
                        {ing.quantity
                          ? `${ing.quantity} ${ing.unit || ""}`
                          : "To taste"}
                      </span>
                      <span className="text-[#6b7280] text-[10px]">
                        {ing.category || "Pantry Staples"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="m-0 text-[#9ca3af] text-[11px] italic">
                No individual ingredients specified for this recipe yet.
              </p>
            )}
          </div>

          {/* Step-by-Step Cooking Instructions */}
          <div>
            <h4 className="m-0 text-[12px] font-bold text-[#111827] mb-2 uppercase tracking-wider">
              Step-by-Step Preparation Steps
            </h4>
            {instructions.length > 0 ? (
              <ol className="m-0 p-0 list-none flex flex-col gap-2">
                {instructions.map((step: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 bg-[#fafbfc] border border-[#eef0f2] p-2.5 rounded-[6px]"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#17181a] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#374151] text-[12px] leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="m-0 text-[#9ca3af] text-[11px] italic">
                No cooking instructions specified for this recipe yet.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#f8f9fa] border-t border-[#e5e7ea]">
          <span className="text-[11px] text-[#71757b]">
            ID: <span className="font-mono">{meal.id.slice(0, 12)}...</span>
          </span>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(meal);
                }}
                className="px-4 py-1.5 bg-[#17181a] text-white font-semibold text-[11px] rounded-[6px] hover:bg-[#2e3035] transition-colors cursor-pointer"
              >
                Edit Recipe
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-[#d0d3d8] bg-white text-[#34363a] font-semibold text-[11px] rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;
