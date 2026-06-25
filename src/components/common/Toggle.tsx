export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={on}
      onClick={onChange}
      className={`toggle ${on ? "on" : ""}`}
    >
      <span />
    </button>
  );
}
export default Toggle;
