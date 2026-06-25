import { useState, useEffect } from "react";
import { useAppData } from "@/context/AppDataContext";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function TextSettings({ type }: { type: "privacy" | "about" }) {
  const { privacy, setPrivacy, about, setAbout } = useAppData();
  const title = type === "privacy" ? "Privacy Policy" : "About Us";
  const source = type === "privacy" ? privacy : about;
  const setter = type === "privacy" ? setPrivacy : setAbout;

  const [text, setText] = useState(source);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setText(source);
    setSuccess("");
  }, [type, source]);

  const save = () => {
    setter(text);
    setSuccess(`${title} saved successfully.`);
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
      <section className="text-settings">
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}
        <div className="editor-bar">
          <button
            type="button"
            className="editor-btn"
            style={{ border: 0, background: "transparent" }}
            onClick={() => applyTag("b")}
          >
            <b>B</b>
          </button>
          <button
            type="button"
            className="editor-btn"
            style={{ border: 0, background: "transparent" }}
            onClick={() => applyTag("i")}
          >
            <i>I</i>
          </button>
          <button
            type="button"
            className="editor-btn"
            style={{ border: 0, background: "transparent" }}
            onClick={() => applyTag("u")}
          >
            <u>U</u>
          </button>
        </div>
        <h3>{title}</h3>
        <textarea
          aria-label={title}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="button" className="dark-button" onClick={save}>
          Save Setting
        </button>
      </section>
    </SettingsLayout>
  );
}
export default TextSettings;
