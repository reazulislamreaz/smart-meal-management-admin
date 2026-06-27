import { useState, type FormEvent } from "react";
import { Mail, Phone } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function ContactSettings() {
  const { contact, setContact } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    email: contact.email === "hello@sizzl.com" ? "Support@gmail.com" : contact.email,
    phone: contact.phone === "+1 123 456 789" ? "5454588" : contact.phone,
  });
  const [success, setSuccess] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess("");
    setContact((prev) => ({
      ...prev,
      email: draft.email,
      phone: draft.phone,
    }));
    setIsEditing(false);
    setSuccess("Contact details updated successfully.");
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

  return (
    <SettingsLayout>
      <section
        className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-[430px] p-[18px] max-[420px]:p-[14px]"
        style={{ padding: "20px", maxWidth: "430px" }}
      >
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        <h3 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600 }}>
          {isEditing ? "Edit Contact us" : "Contact us"}
        </h3>

        {isEditing ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ gap: "4px" }}>
              Email
              <div style={wrapperStyle}>
                <Mail size={15} style={iconStyle} />
                <input
                  type="email"
                  style={inputStyle}
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>
            <label style={{ gap: "4px" }}>
              PhoneNumber
              <div style={wrapperStyle}>
                <Phone size={15} style={iconStyle} />
                <input
                  style={inputStyle}
                  value={draft.phone}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>
            <button
              type="submit"
              className="dark-button wide"
              style={{ marginTop: "12px", height: "38px" }}
            >
              Update Contact
            </button>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ gap: "4px" }}>
              Email
              <div style={wrapperStyle}>
                <Mail size={15} style={iconStyle} />
                <input
                  style={{ ...inputStyle, background: "#f7f8fa" }}
                  value={draft.email}
                  disabled
                />
              </div>
            </label>
            <label style={{ gap: "4px" }}>
              PhoneNumber
              <div style={wrapperStyle}>
                <Phone size={15} style={iconStyle} />
                <input
                  style={{ ...inputStyle, background: "#f7f8fa" }}
                  value={draft.phone}
                  disabled
                />
              </div>
            </label>
            <button
              type="button"
              className="dark-button wide"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "12px", height: "38px" }}
            >
              Edit
            </button>
          </div>
        )}
      </section>
    </SettingsLayout>
  );
}
export default ContactSettings;
