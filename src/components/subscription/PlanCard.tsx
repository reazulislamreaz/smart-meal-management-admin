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
    <div className="bg-white border border-[#e5e7ea] rounded-[7px] overflow-hidden">
      <div className="p-5 text-white bg-[#17181a]">
        <span className="text-[18px] font-bold">{plan.name}</span>
        <p className="text-[16px] text-[#bfc1c4] mt-[7px] mb-0">
          {plan.description}
        </p>
      </div>
      <div className="p-[17px]">
        <strong className="text-[30px]">
          ${plan.price}
          <small className="text-[12px] font-normal text-[#777]">
            /{plan.duration === "annual" ? "Year" : "Month"}
          </small>
        </strong>
        <p className="text-[#777] text-[16px]">
          Every {plan.duration === "annual" ? "Annual" : "Monthly"} Billing
        </p>
        <div className="grid grid-cols-2 gap-[10px] my-[13px]">
          <Link
            to={`/subscription/edit/${plan.id}`}
            className="border-0 rounded-[3px] bg-[#17181a] text-white p-[9px] text-[12px] text-center"
          >
            Edit
          </Link>
          <button
            type="button"
            className="border-0 rounded-[3px] p-[9px] text-[12px] text-center bg-[#ffe1e5] text-[#ff5564]"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
        <h4 className="text-[10px] my-3">Features</h4>
        <ul className="list-none p-0 m-0 grid gap-[10px] text-[#5f6368] text-[12px]">
          {plan.features.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default PlanCard;
