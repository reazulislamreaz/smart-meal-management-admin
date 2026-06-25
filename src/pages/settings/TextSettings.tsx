import { useState, useEffect } from "react";
import { useAppData } from "@/context/AppDataContext";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function TextSettings({ type }: { type: "privacy" | "about" }) {
  const { privacy, setPrivacy, about, setAbout } = useAppData();
  const rawTitle = type === "privacy" ? "Privacy Policy" : "About us";
  const source = type === "privacy" ? privacy : about;
  const setter = type === "privacy" ? setPrivacy : setAbout;

  const [text, setText] = useState(source);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setText(source);
    setIsEditing(false);
    setSuccess("");
  }, [type, source]);

  const handleUpdate = () => {
    setter(text);
    setIsEditing(false);
    setSuccess(`${rawTitle} updated successfully.`);
  };

  const applyTag = (tag: "b" | "i" | "u") => {
    const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = text.slice(start, end);
    if (!selection) return;
    const next = `${text.slice(0, start)}<${tag}>${selection}</${tag}>${text.slice(end)}`;
    setText(next);
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end + 7);
    }, 0);
  };

  return (
    <SettingsLayout>
      <section className="text-settings" style={{ padding: "20px", position: "relative" }}>
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}

        {isEditing ? (
          <>
            <div
              className="editor-bar"
              style={{
                display: "flex",
                gap: "8px",
                borderBottom: "1px solid #eceef0",
                paddingBottom: "8px",
                marginBottom: "12px",
              }}
            >
              <button
                type="button"
                className="editor-btn"
                style={{
                  border: "1px solid #d8dadd",
                  background: "#fff",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
                onClick={() => applyTag("b")}
              >
                <b>B</b>
              </button>
              <button
                type="button"
                className="editor-btn"
                style={{
                  border: "1px solid #d8dadd",
                  background: "#fff",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
                onClick={() => applyTag("i")}
              >
                <i>I</i>
              </button>
              <button
                type="button"
                className="editor-btn"
                style={{
                  border: "1px solid #d8dadd",
                  background: "#fff",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
                onClick={() => applyTag("u")}
              >
                <u>U</u>
              </button>
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 600 }}>
              Edit {rawTitle}
            </h3>
            <textarea
              aria-label={rawTitle}
              value={text}
              onChange={(event) => setText(event.target.value)}
              style={{
                width: "100%",
                height: "220px",
                padding: "10px",
                border: "1px solid #d8dadd",
                borderRadius: "4px",
                fontSize: "12px",
                lineHeight: 1.6,
                resize: "none",
                marginBottom: "16px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                className="outline-button"
                onClick={() => {
                  setText(source);
                  setIsEditing(false);
                }}
                style={{ padding: "6px 16px", borderRadius: "4px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dark-button"
                onClick={handleUpdate}
                style={{ padding: "6px 16px", borderRadius: "4px" }}
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600 }}>
              {rawTitle}
            </h3>
            <div
              style={{
                fontSize: "12px",
                lineHeight: 1.7,
                color: "#55595e",
                whiteSpace: "pre-wrap",
                marginBottom: "40px",
              }}
            >
              {source}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
              }}
            >
              <button
                type="button"
                className="dark-button"
                onClick={() => setIsEditing(true)}
                style={{ padding: "6px 20px", borderRadius: "4px" }}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </section>
    </SettingsLayout>
  );
}
export default TextSettings;
