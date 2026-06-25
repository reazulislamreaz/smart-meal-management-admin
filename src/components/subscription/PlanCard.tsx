import { Link } from "react-router-dom";
import type { SubscriptionPlan } from "@/types/admin";

export function PlanCard({
  plan,
  onDelete,
}: {
  plan: SubscriptionPlan;
  onDelete: () => void;
}) {
  return (
    <div className="plan-card">
      <div className="plan-head">
        <span>{plan.name}</span>
        <p>{plan.description}</p>
      </div>
      <div className="plan-body">
        <strong>
          ${plan.price}
          <small>/{plan.duration === "annual" ? "Year" : "Month"}</small>
        </strong>
        <p>Every {plan.duration === "annual" ? "Annual" : "Monthly"} Billing</p>
        <div className="plan-actions">
          <Link to={`/subscription/edit/${plan.id}`}>Edit</Link>
          <button type="button" className="remove" onClick={onDelete}>
            Delete
          </button>
        </div>
        <h4>Features</h4>
        <ul>
          {plan.features.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default PlanCard;
