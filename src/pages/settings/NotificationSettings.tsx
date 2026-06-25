import { useState, type FormEvent } from "react";
import { useAppData } from "@/context/AppDataContext";
import Toggle from "@/components/common/Toggle";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

const fields = [
  ["Show Notification", "show"],
  ["New Meals added notification", "added"],
  ["Subscriber cancel alert", "cancel"],
  ["Price Change alert", "price"],
];

export function NotificationSettings() {
  const { preferences, setPreferences } = useAppData();
  const [switches, setSwitches] = useState([...preferences.notifications]);
  const [success, setSuccess] = useState("");

  const update = (index: number) => {
    setSwitches((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? !item : item)),
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess("");
    setPreferences((current) => ({ ...current, notifications: [...switches] }));
    setSuccess("Notification settings saved successfully.");
  };

  return (
    <SettingsLayout>
      <form className="notification-card" onSubmit={handleSubmit}>
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        {fields.map(([label]) => (
          <div key={label}>
            <h3>{label}</h3>
            <p>You can change notifications here.</p>
          </div>
        ))}
        {fields.map(([, id], i) => (
          <Toggle
            key={id}
            on={switches[i]}
            onChange={() => update(i)}
            label={fields[i][0]}
          />
        ))}
        <button type="submit" className="dark-button">
          Save Setting
        </button>
      </form>
    </SettingsLayout>
  );
}
export default NotificationSettings;
