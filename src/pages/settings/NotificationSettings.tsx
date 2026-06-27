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
      <form
        className="bg-white border border-[#e5e7ea] rounded-[7px] grid grid-cols-[1fr_auto] items-center px-[18px] pt-2 pb-[17px] max-[420px]:px-[13px] [&_.dark-button]:mt-[14px] [&_.dark-button]:col-[1/-1] [&_.dark-button]:justify-self-end"
        onSubmit={handleSubmit}
      >
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        {fields.map(([label]) => (
          <div className="border-b border-[#eceef0] py-[14px]" key={label}>
            <h3 className="m-0 mb-1 text-[12px]">{label}</h3>
            <p className="m-0 text-[#777] text-[16px]">
              You can change notifications here.
            </p>
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
