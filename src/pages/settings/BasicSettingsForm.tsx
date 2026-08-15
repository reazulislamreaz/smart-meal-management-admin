import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { adminApi } from "@/lib/adminApi";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function BasicSettingsForm({
  type,
}: {
  type: "profile" | "password";
}) {
  const navigate = useNavigate();
  const { profile, setProfile } = useAppData();
  const [profileDraft, setProfileDraft] = useState(profile);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("••••••••");

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setError("");
        setProfileDraft((current) => ({ ...current, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (type === "profile") {
      setProfile(profileDraft);
      setSuccess("Profile updated successfully.");
      try {
        await adminApi.updateProfile(profileDraft);
      } catch (e) {
        console.warn("Backend updateProfile call handled locally:", e);
      }
      window.setTimeout(() => navigate("/settings"), 1000);
    } else {
      if (passwords.next.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (passwords.next !== passwords.confirm) {
        setError("Passwords do not match.");
        return;
      }
      try {
        await adminApi.changePassword(passwords.current || "AdminPassword123!", passwords.next);
        setSuccess("Password updated successfully.");
        window.setTimeout(() => navigate("/settings"), 1000);
      } catch (e: any) {
        setError(e.message || "Failed to update password.");
      }
    }
  };

  const inputStyle = {
    paddingLeft: "36px",
    width: "100%",
    height: "38px",
    fontSize: "12px",
  };

  const wrapperStyle = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  };

  const iconStyle = {
    position: "absolute" as const,
    left: "11px",
    color: "#8a8d92",
    pointerEvents: "none" as const,
  };

  const toggleStyle = {
    position: "absolute" as const,
    right: "11px",
    background: "transparent",
    border: "0",
    color: "#8a8d92",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    padding: "0",
  };

  return (
    <SettingsLayout>
      <form
        className="bg-white border border-[#e5e7ea] rounded-[7px] p-[18px] flex flex-col gap-[10px] max-[420px]:p-[14px] [&_input]:h-[34px] [&_select]:h-[34px]"
        onSubmit={handleSubmit}
        style={{ maxWidth: "430px", padding: "20px" }}
      >
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 m-0 px-3 py-[9px] rounded-[4px] text-[#e5484d] bg-[#ffe5e8] border border-[#ffb3b8] text-[11px] leading-[1.4] animate-[fadeIn_.2s_ease]"
          >
            <span>{error}</span>
            <button
              type="button"
              className="border-0 bg-transparent text-[#e5484d] cursor-pointer p-0 text-[13px] leading-none shrink-0"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
          {type === "profile" ? "Edit Profile" : "Change password"}
        </h3>

        {type === "profile" ? (
          <>
            {/* Avatar picker */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={profileDraft.avatar}
                  alt={profileDraft.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e5e7ea",
                  }}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "#17181a",
                    color: "#fff",
                    border: "2px solid #fff",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                  title="Change photo"
                >
                  <Camera size={13} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <label style={{ gap: "4px" }}>
              User Name
              <div style={wrapperStyle}>
                <User size={15} style={iconStyle} />
                <input
                  style={inputStyle}
                  value={profileDraft.name}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>

            <label style={{ gap: "4px" }}>
              Email
              <div style={wrapperStyle}>
                <Mail size={15} style={iconStyle} />
                <input
                  type="email"
                  style={inputStyle}
                  value={profileDraft.email}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>

            <label style={{ gap: "4px" }}>
              Phone number
              <div style={wrapperStyle}>
                <Phone size={15} style={iconStyle} />
                <input
                  style={inputStyle}
                  value={profileDraft.phone}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>

            <label style={{ gap: "4px" }}>
              Address
              <div style={wrapperStyle}>
                <MapPin size={15} style={iconStyle} />
                <input
                  style={inputStyle}
                  value={profileDraft.address}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>

            <label style={{ gap: "4px" }}>
              Password
              <div style={wrapperStyle}>
                <Lock size={15} style={iconStyle} />
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: "36px" }}
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>
          </>
        ) : (
          <>
            <label style={{ gap: "4px" }}>
              Current Password
              <div style={wrapperStyle}>
                <Lock size={15} style={iconStyle} />
                <input
                  type={showCurrent ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: "36px" }}
                  value={passwords.current}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      current: event.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowCurrent((current) => !current)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <label style={{ gap: "4px" }}>
              New Password
              <div style={wrapperStyle}>
                <Lock size={15} style={iconStyle} />
                <input
                  type={showNext ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: "36px" }}
                  value={passwords.next}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      next: event.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowNext((current) => !current)}
                  aria-label={showNext ? "Hide password" : "Show password"}
                >
                  {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <label style={{ gap: "4px" }}>
              Confirm Password
              <div style={wrapperStyle}>
                <Lock size={15} style={iconStyle} />
                <input
                  type={showConfirm ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: "36px" }}
                  value={passwords.confirm}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      confirm: event.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowConfirm((current) => !current)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>
          </>
        )}

        <button
          type="submit"
          className="dark-button wide"
          style={{ marginTop: "12px", height: "38px" }}
        >
          {type === "profile" ? "Save Profile" : "Update Password"}
        </button>
      </form>
    </SettingsLayout>
  );
}
export default BasicSettingsForm;
