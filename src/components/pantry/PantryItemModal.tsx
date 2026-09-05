import { useState, useEffect, type FormEvent } from "react";
import {
  X,
  Calendar,
  PackagePlus,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  adminApi,
  type PantryItemModel,
  type CreatePantryItemInput,
} from "@/lib/adminApi";

export interface PantryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: PantryItemModel | null;
  onSuccess?: (savedItem: PantryItemModel) => void;
}

const PANTRY_CATEGORIES = [
  "Pantry Staples",
  "Produce",
  "Meat & Fish",
  "Dairy",
  "Bakery",
  "Frozen",
  "Canned Goods",
  "Beverages",
  "Spices & Condiments",
  "Snacks",
  "Other",
];

const COMMON_UNITS = [
  "pcs",
  "g",
  "kg",
  "ml",
  "L",
  "can",
  "bottle",
  "box",
  "bag",
  "tbsp",
];

export function PantryItemModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: PantryItemModalProps) {
  const [ingredientName, setIngredientName] = useState("");
  const [category, setCategory] = useState("Pantry Staples");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [unit, setUnit] = useState("pcs");
  const [isLowStock, setIsLowStock] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setIngredientName(item.ingredientName || "");
        setCategory(item.category || "Pantry Staples");
        setQuantity(item.quantity !== undefined ? item.quantity : 1);
        setUnit(item.unit || "pcs");
        setIsLowStock(!!item.isLowStock);
        setExpiryDate(
          item.expiryDate
            ? new Date(item.expiryDate).toISOString().split("T")[0]
            : "",
        );
      } else {
        setIngredientName("");
        setCategory("Pantry Staples");
        setQuantity(1);
        setUnit("pcs");
        setIsLowStock(false);
        setExpiryDate("");
      }
      setError(null);
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  // Determine smart step increment/decrement based on active unit
  const getStepAmount = (currentUnit: string, currentVal: number): number => {
    const u = currentUnit.toLowerCase();
    if (u === "g" || u === "ml") {
      if (currentVal >= 500) return 100;
      if (currentVal >= 100) return 50;
      return 25;
    }
    if (u === "kg" || u === "l") {
      return 0.5;
    }
    return 1;
  };

  const handleIncrement = () => {
    const currentVal = parseFloat(String(quantity)) || 0;
    const step = getStepAmount(unit, currentVal);
    const newVal = Math.round((currentVal + step) * 100) / 100;
    setQuantity(newVal);
  };

  const handleDecrement = () => {
    const currentVal = parseFloat(String(quantity)) || 0;
    const step = getStepAmount(unit, currentVal);
    const minVal = unit === "kg" || unit === "L" ? 0.1 : 1;
    const newVal = Math.max(
      minVal,
      Math.round((currentVal - step) * 100) / 100,
    );
    setQuantity(newVal);
  };

  // Quick quantity presets based on selected unit
  const getQuantityPresets = (currentUnit: string): Array<number | string> => {
    const u = currentUnit.toLowerCase();
    if (u === "g" || u === "ml") return [100, 250, 500, 1000];
    if (u === "kg" || u === "l") return [0.5, 1, 2, 5];
    if (u === "can" || u === "bottle") return [1, 2, 4, 6];
    return [1, 2, 6, 12];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!ingredientName.trim()) {
      setError("Item name is required.");
      return;
    }

    const parsedQty = parseFloat(String(quantity));
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setError("Please enter a valid positive quantity.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: CreatePantryItemInput = {
        ingredientName: ingredientName.trim(),
        category: category.trim() || "Pantry Staples",
        quantity: parsedQty,
        unit: unit.trim() || "pcs",
        isLowStock,
        // Expiry date is completely optional: only send ISO string if non-empty, otherwise null
        expiryDate: expiryDate.trim()
          ? new Date(expiryDate).toISOString()
          : null,
      };

      let saved: PantryItemModel;
      if (item?.id) {
        saved = await adminApi.updatePantryItem(item.id, payload);
        toast.success(
          `Updated "${saved.ingredientName}" (${saved.quantity} ${saved.unit}) in pantry.`,
        );
      } else {
        saved = await adminApi.addPantryItem(payload);
        toast.success(
          `Added "${saved.ingredientName}" (${saved.quantity} ${saved.unit}) to pantry.`,
        );
      }

      if (onSuccess) {
        onSuccess(saved);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save pantry item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.55)] backdrop-blur-xs p-4 animate-[fadeIn_.15s_ease]">
      <div className="bg-white border border-[#e5e7ea] rounded-[14px] shadow-[0_24px_54px_rgba(0,0,0,0.2)] w-full max-w-[500px] overflow-hidden animate-[scaleIn_.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f1f3] bg-[#fafbfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center border border-[#dbeafe]">
              <PackagePlus size={16} />
            </div>
            <div>
              <h3 className="m-0 text-[15px] font-bold text-[#111827]">
                {item ? "Edit Pantry Item" : "Add Pantry Item"}
              </h3>
              <p className="m-0 text-[11px] text-[#6b7280]">
                Track stock and auto-deduct ingredients from shopping lists.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb] hover:text-[#111827] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-4 text-[12px]"
        >
          {error && (
            <div className="p-3 bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-[8px] flex items-center gap-2 text-[12px]">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Ingredient Name */}
          <div>
            <label className="block text-[12px] font-bold text-[#374151] mb-1">
              Item Name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Minced Beef, Extra Virgin Olive Oil, Chickpeas"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              className="w-full px-3 py-2 border border-[#d1d5db] rounded-[7px] text-[13px] text-[#111827] outline-hidden focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all placeholder:text-[#9ca3af]"
            />
          </div>

          {/* Department / Category */}
          <div>
            <label className="block text-[12px] font-bold text-[#374151] mb-1">
              Department / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[#d1d5db] rounded-[7px] text-[13px] text-[#111827] bg-white outline-hidden focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all cursor-pointer"
            >
              {PANTRY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Direct Quantity Input & Unit Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#fbfcfd] p-3.5 border border-[#e5e7eb] rounded-[10px]">
            {/* Quantity with Direct Input + Stepper */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-bold text-[#374151]">
                  Quantity <span className="text-[#dc2626]">*</span>
                </label>
                <span className="text-[11px] text-[#6b7280]">
                  Type directly
                </span>
              </div>

              {/* Direct numeric input with + and - convenience controls */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="absolute left-1.5 z-10 w-7 h-7 rounded-[5px] bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] flex items-center justify-center cursor-pointer transition-colors border border-[#e5e7eb]"
                  title="Decrease quantity"
                >
                  <Minus size={13} />
                </button>

                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="e.g. 500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full text-center px-10 py-2 border border-[#d1d5db] rounded-[7px] text-[14px] font-bold text-[#111827] bg-white outline-hidden focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                />

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="absolute right-1.5 z-10 w-7 h-7 rounded-[5px] bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] flex items-center justify-center cursor-pointer transition-colors border border-[#e5e7eb]"
                  title="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Quick Quantity Presets Chips */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {getQuantityPresets(unit).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`px-2 py-0.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer ${
                      Number(quantity) === Number(preset)
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Selection */}
            <div>
              <label className="block text-[12px] font-bold text-[#374151] mb-1">
                Unit
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="pantry-units"
                  placeholder="e.g. g, kg, pcs, L, can"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-[7px] text-[13px] font-semibold text-[#111827] bg-white outline-hidden focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                />
                <datalist id="pantry-units">
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u} />
                  ))}
                </datalist>
              </div>

              {/* Quick Unit Presets Chips */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {["g", "kg", "pcs", "ml", "L", "can"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-2 py-0.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer ${
                      unit === u
                        ? "bg-[#111827] text-white"
                        : "bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expiry Date (OPTIONAL) */}
          <div className="border border-[#e5e7eb] rounded-[8px] p-3 bg-[#fbfcfd]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-bold text-[#374151] flex items-center gap-1.5">
                <Calendar size={13} className="text-[#6b7280]" />
                Expiry Date{" "}
                <span className="text-[11px] font-normal text-[#6b7280]">
                  (Optional)
                </span>
              </label>
              {expiryDate && (
                <button
                  type="button"
                  onClick={() => setExpiryDate("")}
                  className="text-[10px] text-[#ef4444] hover:underline cursor-pointer font-medium"
                >
                  Clear date
                </button>
              )}
            </div>
            <p className="m-0 text-[11px] text-[#6b7280] mb-2">
              Leave blank if this item does not expire or has no stamped date.
            </p>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#d1d5db] rounded-[6px] text-[12px] text-[#111827] bg-white outline-hidden focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>

          {/* Low Stock Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={isLowStock}
              onChange={(e) => setIsLowStock(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
            />
            <span className="text-[12px] text-[#374151]">
              Mark as low stock (prioritize re-ordering)
            </span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#f0f1f3] mt-2">
            <div className="text-[11px] text-[#6b7280] font-medium flex items-center gap-1">
              <Check size={13} className="text-[#10b981]" />
              Saving:{" "}
              <strong className="text-[#111827]">
                {quantity || 0} {unit || "pcs"}
              </strong>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-[#d1d5db] bg-white text-[#374151] text-[12px] font-semibold rounded-[7px] hover:bg-[#f9fafb] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#17181a] hover:bg-[#2563eb] text-white text-[12px] font-bold rounded-[7px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                {item ? "Save Changes" : "Add to Pantry"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PantryItemModal;
