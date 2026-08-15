import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(17, 24, 39, 0.55)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        animation: "fadeIn 0.15s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          animation: "scaleUp 0.15s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                variant === "danger"
                  ? "bg-[#fee2e2] text-[#dc2626]"
                  : "bg-[#fef3c7] text-[#d97706]"
              }`}
            >
              {variant === "danger" ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="m-0 text-[15px] font-bold text-[#111827] leading-snug">{title}</h3>
              {itemName && (
                <span className="text-[12px] font-medium text-[#4b5563] truncate max-w-[240px] block">
                  {itemName}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors border-0 bg-transparent cursor-pointer p-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Message */}
        <div className="px-5 py-2">
          <p className="m-0 text-[13px] text-[#4b5563] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 bg-[#f9fafb] border-t border-[#f3f4f6] mt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-[34px] px-4 rounded-[8px] border border-[#d1d5db] bg-white text-[#374151] text-[12px] font-semibold cursor-pointer transition-all hover:bg-[#f3f4f6] hover:border-[#9ca3af]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-[34px] px-4 rounded-[8px] border-0 text-white text-[12px] font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              variant === "danger"
                ? "bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b]"
                : "bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e]"
            } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-3.5 w-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{isLoading ? "Processing..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
