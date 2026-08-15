import { X, Mail, CheckCircle2, Clock, Trash2, Calendar, User } from "lucide-react";
import type { AdminContactMessage } from "@/lib/adminApi";

export interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: AdminContactMessage | null;
  onUpdateStatus: (id: string, status: "UNREAD" | "READ" | "RESOLVED") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function MessageDetailModal({
  isOpen,
  onClose,
  message,
  onUpdateStatus,
  onDelete,
  isLoading = false,
}: MessageDetailModalProps) {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,24,26,0.4)] backdrop-blur-xs p-4 animate-[fadeIn_.15s_ease]">
      <div className="bg-white border border-[#e5e7ea] rounded-[10px] shadow-[0_16px_36px_rgba(0,0,0,0.16)] w-full max-w-[540px] p-6 animate-[scaleIn_.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0f1f3]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#17181a]" />
            <h3 className="m-0 text-[16px] font-bold text-[#17181a]">
              Support Inquiry Details
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

        {/* Sender Info Card */}
        <div className="bg-[#f8f9fa] border border-[#eef0f2] rounded-[8px] p-3.5 mb-4 text-[12px] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#111827]">
              <User size={13} className="text-[#8a8d92]" />
              <span>{message.name}</span>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-[4px] ${message.status === "RESOLVED" ? "bg-[#dcfce7] text-[#15803d]" : message.status === "READ" ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#fee2e2] text-[#b91c1c]"}`}
            >
              {message.status}
            </span>
          </div>

          <div className="text-[#6b7280]">
            <strong>Email: </strong>
            <a
              href={`mailto:${message.email}`}
              className="text-[#2563eb] hover:underline"
            >
              {message.email}
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#9ca3af]">
            <Calendar size={12} />
            <span>Received on {new Date(message.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Subject & Message Content */}
        <div className="mb-6">
          <span className="block text-[#52565b] font-medium text-[11px] mb-1">
            Subject
          </span>
          <h4 className="m-0 text-[14px] font-bold text-[#111827] mb-3">
            {message.subject || "No Subject"}
          </h4>

          <span className="block text-[#52565b] font-medium text-[11px] mb-1">
            Message
          </span>
          <div className="bg-white border border-[#e5e7ea] rounded-[6px] p-3.5 text-[12px] text-[#374151] leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap">
            {message.message}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-[#f0f1f3]">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onDelete(message.id)}
            className="px-3 py-2 border border-[#fecaca] text-[#ef4444] rounded-[6px] text-[11px] font-bold hover:bg-[#fee2e2] transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Trash2 size={12} />
            <span>Delete Inquiry</span>
          </button>

          <div className="flex items-center gap-2">
            {message.status !== "RESOLVED" && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onUpdateStatus(message.id, "RESOLVED")}
                className="px-4 py-2 bg-[#10b981] text-white rounded-[6px] text-[11px] font-bold hover:bg-[#059669] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <CheckCircle2 size={12} />
                <span>Mark as Resolved</span>
              </button>
            )}

            {message.status === "UNREAD" && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onUpdateStatus(message.id, "READ")}
                className="px-4 py-2 bg-[#17181a] text-white rounded-[6px] text-[11px] font-bold hover:bg-[#2e3035] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Clock size={12} />
                <span>Mark as Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#d0d3d8] rounded-[6px] bg-white text-[#34363a] font-semibold text-[11px] hover:bg-[#f7f8fa] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageDetailModal;
