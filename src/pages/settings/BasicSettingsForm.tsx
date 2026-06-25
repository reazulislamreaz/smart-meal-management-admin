import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import { useStoredState } from "@/hooks/useStoredState";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function BasicSettingsForm({
  type,
}: {
  type: "profile" | "password" | "language";
}) {
  const navigate = useNavigate();
  const { profile, setProfile, preferences, setPreferences } = useAppData();
  const [storedPassword, setStoredPassword] = useStoredState(
    "sizzl-password",
    "",
  );
  const [profileDraft, setProfileDraft] = useState(profile);
  const [language, setLanguage] = useState(preferences.language);
  const [timezone, setTimezone] = useState(preferences.timezone);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (type === "profile") {
      setProfile(profileDraft);
      setSuccess("Profile updated successfully.");
    }
    if (type === "language") {
      setPreferences((current) => ({ ...current, language, timezone }));
      setSuccess("Language settings saved successfully.");
    }
    if (type === "password") {
      if (storedPassword && passwords.current !== storedPassword) {
        setError("Current password is incorrect.");
        return;
      }
      if (passwords.next.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      if (passwords.next !== passwords.confirm) {
        setError("New passwords do not match.");
        return;
      }
      setStoredPassword(passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      setSuccess("Password updated successfully.");
    }
    window.setTimeout(() => navigate("/settings"), 900);
  };

  return (
    <SettingsLayout>
      <form className="form-card settings-form" onSubmit={handleSubmit}>
        <h3>
          {type === "profile"
            ? "Edit Profile"
            : type === "password"
              ? "Change Password"
              : "Change Language"}
        </h3>
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        {type === "profile" && (
          <>
            <label>
              Full Name
              <input
                value={profileDraft.name}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={profileDraft.email}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Phone
              <input
                value={profileDraft.phone}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Address
              <input
                value={profileDraft.address}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                required
              />
            </label>
          </>
        )}
        {type === "password" && (
          <>
            <label>
              Current Password
              <input
                type="password"
                value={passwords.current}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    current: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={passwords.next}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    next: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={passwords.confirm}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    confirm: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
          </>
        )}
        {type === "language" && (
          <>
            <label>
              Change Language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                required
              >
                <option>English (UK)</option>
                <option>English (US)</option>
                <option>বাংলা</option>
              </select>
            </label>
            <label>
              Time Zone
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                required
              >
                <option>GMT +06:00</option>
                <option>GMT +00:00</option>
                <option>GMT -05:00</option>
              </select>
            </label>
          </>
        )}
        {error && (
          <p className="form-message error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="dark-button wide">
          {type === "language" ? "Save Setting" : "Save Changes"}
        </button>
      </form>
    </SettingsLayout>
  );
}
export default BasicSettingsForm;
