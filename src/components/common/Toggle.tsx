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
      className={`w-[32px] h-[17px] border-0 rounded-[9px] p-[2px] ${on ? "bg-[#17181a]" : "bg-[#d4d6da]"}`}
    >
      <span
        className={`block w-[13px] h-[13px] rounded-full bg-white transition-transform duration-150 ${on ? "translate-x-[15px]" : ""}`}
      />
    </button>
  );
}
export default Toggle;
