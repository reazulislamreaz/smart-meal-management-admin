import { Link, useSearchParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { initialPlans } from "@/data/adminData";
import PageHeading from "@/components/common/PageHeading";
import EmptyState from "@/components/common/EmptyState";
import PlanCard from "@/components/subscription/PlanCard";

export function SubscriptionPlans() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const [plans, setPlans] = useStoredState("sizzl-plans", initialPlans);
  const filteredPlans = plans.filter((plan) =>
    [plan.name, plan.description, ...plan.features]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
  return (
    <>
      <PageHeading
        title="Subscription"
        action={
          <Link to="/subscription/create" className="dark-button">
            Create Subscription
          </Link>
        }
      />
      <p className="subtitle">Manage your Subscription.</p>
      <div className="plans-grid">
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onDelete={() =>
              setPlans((current) =>
                current.filter((item) => item.id !== plan.id),
              )
            }
          />
        ))}
        {!filteredPlans.length && (
          <EmptyState
            label={query ? "No plans match your search" : "No subscription plans"}
          />
        )}
      </div>
    </>
  );
}
export default SubscriptionPlans;
