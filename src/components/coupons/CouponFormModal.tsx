import React, { useState, useEffect } from "react";
import { X, Tag, Percent, Calendar, Users } from "lucide-react";
import type { AdminCouponItem } from "@/lib/adminApi";

export interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    code: string;
    discountPercent: number;
    validUntil?: string | null;
    maxRedemptions?: number;
    isActive?: boolean;
  }) => Promise<void>;
  coupon?: AdminCouponItem | null;
  isLoading?: boolean;
}

export function CouponFormModal({
  isOpen,
  onClose,
  onSave,
  coupon,
  isLoading = false,
}: CouponFormModalProps) {
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [validUntil, setValidUntil] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState(100);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setDiscountPercent(coupon.discountPercent);
      setValidUntil(
        coupon.validUntil ? coupon.validUntil.split("T")[0] : "",
      );
      setMaxRedemptions(coupon.maxRedemptions);
      setIsActive(coupon.isActive);
    } else {
      setCode("");
      setDiscountPercent(10);
      setValidUntil("");
      setMaxRedemptions(100);
      setIsActive(true);
    }
    setError("");
  }, [coupon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter a valid coupon code (e.g. SUMMER50)");
      return;
    }
    if (discountPercent <= 0 || discountPercent > 100) {
      setError("Discount percentage must be between 1% and 100%");
      return;
    }
    if (maxRedemptions <= 0) {
      setError("Max redemptions must be greater than 0");
      return;
    }

    try {
      await onSave({
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
        maxRedemptions: Number(maxRedemptions),
        isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save coupon code.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,24,26,0.4)] backdrop-blur-xs p-4 animate-[fadeIn_.15s_ease]">
      <div className="bg-white border border-[#e5e7ea] rounded-[10px] shadow-[0_16px_36px_rgba(0,0,0,0.16)] w-full max-w-[460px] p-6 animate-[scaleIn_.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0f1f3]">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#17181a]" />
            <h3 className="m-0 text-[16px] font-bold text-[#17181a]">
              {coupon ? "Edit Promotional Coupon" : "Create New Coupon"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8d92] hover:text-[#17181a] cursor-pointer transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 bg-[#ffe5e8] border border-[#ffb3b8] text-[#e5484d] rounded-[6px] text-[11px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-[12px]">
          <div>
            <label className="text-[#52565b] font-medium mb-1">
              Coupon Code
            </label>
            <div className="relative flex items-center">
              <Tag className="absolute left-3 w-4 h-4 text-[#8a8d92]" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. MKA-2021, SAVE50"
                className="w-full h-9 pl-9 pr-3 uppercase font-mono font-bold tracking-wider text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Discount Percent (%)
              </label>
              <div className="relative flex items-center">
                <Percent className="absolute left-3 w-4 h-4 text-[#8a8d92]" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full h-9 pl-9 pr-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[#52565b] font-medium mb-1">
                Max Redemptions
              </label>
              <div className="relative flex items-center">
                <Users className="absolute left-3 w-4 h-4 text-[#8a8d92]" />
                <input
                  type="number"
                  min="1"
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                  className="w-full h-9 pl-9 pr-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[#52565b] font-medium mb-1">
              Expiration Date (Optional)
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 w-4 h-4 text-[#8a8d92]" />
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-[12px] border border-[#d1d4d9] rounded-[6px] focus:border-[#17181a] outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCoupon"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-[#17181a]"
            />
            <label htmlFor="isActiveCoupon" className="cursor-pointer font-medium select-none">
              Activate coupon immediately upon saving
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-[#f0f1f3]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-[#d0d3d8] rounded-[6px] bg-white text-[#34363a] font-semibold text-[12px] hover:bg-[#f7f8fa] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#17181a] text-white font-semibold text-[12px] rounded-[6px] hover:bg-[#2e3035] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CouponFormModal;
