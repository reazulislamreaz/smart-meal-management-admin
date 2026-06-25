import { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { initialPlans } from "@/data/adminData";
import PageHeading from "@/components/common/PageHeading";
import EmptyState from "@/components/common/EmptyState";
import PlanCard from "@/components/subscription/PlanCard";
import SettingsToast from "@/components/common/SettingsToast";

export function SubscriptionPlans() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const [plans, setPlans] = useStoredState("sizzl-plans", initialPlans);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clean up navigation state so it doesn't show toast on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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

      {success && (
        <div style={{ marginBottom: "15px" }}>
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        </div>
      )}

      <div className="plans-grid">
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onDelete={() => {
              setPlans((current) =>
                current.filter((item) => item.id !== plan.id),
              );
              setSuccess("Subscription plan deleted successfully.");
            }}
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
