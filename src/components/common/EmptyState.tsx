export function EmptyState({ label = "No results found" }: { label?: string }) {
  return <div className="empty-state">{label}</div>;
}
export default EmptyState;
