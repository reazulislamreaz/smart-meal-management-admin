import { useState, useEffect, useRef } from "react";
import { useAppData } from "@/context/AppDataContext";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

// Escape all HTML, then re-enable only the b/i/u formatting tags. This keeps the
// preview safe from arbitrary HTML while still rendering the editor's formatting.
const renderFormatted = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&lt;(\/?)(b|i|u)&gt;/g, "<$1$2>");

export function TextSettings({ type }: { type: "privacy" | "about" }) {
  const { privacy, setPrivacy, about, setAbout } = useAppData();
  const rawTitle = type === "privacy" ? "Privacy Policy" : "About us";
  const source = type === "privacy" ? privacy : about;
  const setter = type === "privacy" ? setPrivacy : setAbout;

  const [text, setText] = useState(source);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;
    const selection = text.slice(start, end);

    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;

    let next: string;
    let nextStart: number;
    let nextEnd: number;

    if (selection.startsWith(openTag) && selection.endsWith(closeTag)) {
      // Toggle off: unwrap an already-wrapped selection.
      const inner = selection.slice(openTag.length, selection.length - closeTag.length);
      next = `${text.slice(0, start)}${inner}${text.slice(end)}`;
      nextStart = start;
      nextEnd = start + inner.length;
    } else {
      next = `${text.slice(0, start)}${openTag}${selection}${closeTag}${text.slice(end)}`;
      nextStart = start + openTag.length;
      nextEnd = end + openTag.length;
    }

    setText(next);
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(nextStart, nextEnd);
    }, 0);
  };

  return (
    <SettingsLayout>
      <section className="bg-white border border-[#e5e7ea] rounded-[7px] p-[18px] min-h-[230px] max-[420px]:p-[14px] [&_.dark-button]:float-right [&_.dark-button]:min-w-[80px]" style={{ padding: "20px", position: "relative" }}>
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}

        {isEditing ? (
          <>
            <div
              className="h-[22px] flex justify-end gap-[10px] text-[#555] [&_:is(b,i,u,span)]:cursor-default [&_:is(b,i,u,span)]:px-1 [&_:is(b,i,u,span)]:py-[2px] [&_:is(b,i,u,span)]:rounded-[2px] [&_:is(b,i,u,span)]:transition-[background,color] [&_:is(b,i,u,span)]:duration-150 [&_:is(b,i,u,span):hover]:bg-[#f0f1f3] [&_:is(b,i,u,span):hover]:text-[#17181a]"
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
              ref={textareaRef}
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
              dangerouslySetInnerHTML={{ __html: renderFormatted(source) }}
            />
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
