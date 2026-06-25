import { useState, type FormEvent } from "react";
import { useAppData } from "@/context/AppDataContext";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function ContactSettings() {
  const { contact, setContact } = useAppData();
  const [draft, setDraft] = useState(contact);
  const [success, setSuccess] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess("");
    setContact(draft);
    setSuccess("Contact details saved successfully.");
  };

  return (
    <SettingsLayout>
      <section className="contact-card">
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        <h3>Contact Us</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={draft.email}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Phone Number
            <input
              value={draft.phone}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Location Address
            <input
              value={draft.address}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              required
            />
          </label>
          <button type="submit" className="dark-button">
            Save Setting
          </button>
        </form>
      </section>
    </SettingsLayout>
  );
}
export default ContactSettings;
