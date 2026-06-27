import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (type === "profile") {
      setProfile(profileDraft);
      setSuccess("Profile updated successfully.");
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
      setSuccess("Password updated successfully.");
      window.setTimeout(() => navigate("/settings"), 1000);
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
        <h3 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600 }}>
          {type === "profile" ? "Edit Profile" : "Change Password"}
        </h3>
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}

        {type === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ gap: "4px" }}>
              User name
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
              Enter Password
              <div style={wrapperStyle}>
                <Lock size={15} style={iconStyle} />
                <input
                  type={showPassword ? "text" : "password"}
                  style={inputStyle}
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>
          </div>
        )}

        {type === "password" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ gap: "4px" }}>
              Current Password
              <div style={wrapperStyle}>
                <Lock size={15} style={iconStyle} />
                <input
                  type={showCurrent ? "text" : "password"}
                  style={inputStyle}
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      current: event.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowCurrent((v) => !v)}
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
                  style={inputStyle}
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      next: event.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowNext((v) => !v)}
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
                  style={inputStyle}
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      confirm: event.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  style={toggleStyle}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>
          </div>
        )}

        {error && (
          <p
            className="m-0 text-[#ff5361] text-[11px] leading-[1.4]"
            role="alert"
            style={{ marginTop: "10px" }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          className="dark-button wide"
          style={{ marginTop: "20px", height: "38px" }}
        >
          {type === "profile" ? "Update Profile" : "Update Password"}
        </button>
      </form>
    </SettingsLayout>
  );
}
export default BasicSettingsForm;
