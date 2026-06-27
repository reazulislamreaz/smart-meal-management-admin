import { useEffect } from "react";

export function SettingsToast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  return (
    <p
      className="m-0 mb-2 px-3 py-[10px] rounded-[4px] text-[#1a7a42] bg-[#e5faed] border border-[#c8efd8] text-[11px] leading-[1.4] animate-[fadeIn_.2s_ease] col-[1/-1]"
      role="status"
    >
      {message}
    </p>
  );
}
export default SettingsToast;
