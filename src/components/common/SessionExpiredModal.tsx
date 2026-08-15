import { useEffect } from "react";
import { LogOut, ShieldAlert } from "lucide-react";

interface SessionExpiredModalProps {
  isOpen: boolean;
  message?: string;
  onLoginAgain: () => void;
}

export function SessionExpiredModal({
  isOpen,
  message = "Your session has expired for security reasons. Please log in again to continue managing the platform.",
  onLoginAgain,
}: SessionExpiredModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        onLoginAgain();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onLoginAgain]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(17, 24, 39, 0.7)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          textAlign: "center",
          padding: "28px 24px 22px",
        }}
      >
        {/* Warning Icon Badge */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <ShieldAlert className="w-7 h-7 text-[#dc2626]" />
        </div>

        {/* Title */}
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Session Expired
        </h3>

        {/* Message */}
        <p
          style={{
            margin: "0 0 24px",
            fontSize: "13px",
            lineHeight: 1.5,
            color: "#4b5563",
          }}
        >
          {message}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onLoginAgain}
          autoFocus
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "10px",
            border: 0,
            backgroundColor: "#17181a",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.15s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#27292c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#17181a")}
        >
          <LogOut className="w-4 h-4" />
          <span>Log In Again</span>
        </button>
      </div>
    </div>
  );
}

export default SessionExpiredModal;
