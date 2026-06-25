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
    <p className="settings-toast" role="status">
      {message}
    </p>
  );
}
export default SettingsToast;
