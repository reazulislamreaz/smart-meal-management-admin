import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { initialPlans } from "@/data/adminData";
import { adminApi } from "@/lib/adminApi";
import type { SubscriptionPlan } from "@/types/admin";
import PageHeading from "@/components/common/PageHeading";
import PlanCard from "@/components/subscription/PlanCard";
import EmptyState from "@/components/common/EmptyState";
import SettingsToast from "@/components/common/SettingsToast";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export function SubscriptionPlans() {
  const [plans, setPlans] = useStoredState<SubscriptionPlan[]>(
    "sizzl-subscription-plans",
    initialPlans,
  );
  const location = useLocation();
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  // Confirm delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlan | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    plan: null,
    isLoading: false,
  });

  const fetchPlans = () => {
    adminApi
      .getSubscriptionPlans()
      .then((res) => {
        if (res && Array.isArray(res) && res.length > 0) {
          const mapped: SubscriptionPlan[] = res.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            price: String(p.price),
            duration: (p.interval === "yearly" || p.duration === "annual") ? "annual" : "monthly",
            features: p.features || [],
          }));
          setPlans(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote plans, using local cache:", err.message);
      });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const requestDeletePlan = (plan: SubscriptionPlan) => {
    setDeleteConfirm({
      isOpen: true,
      plan,
      isLoading: false,
    });
  };

  const confirmDeletePlan = async () => {
    if (!deleteConfirm.plan) return;
    const { id, name } = deleteConfirm.plan;

    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));

    setPlans((current) => current.filter((item) => item.id !== id));
    setSuccess(`Subscription plan "${name}" deleted successfully.`);

    try {
      await adminApi.deleteSubscriptionPlan(id);
      fetchPlans();
    } catch (e) {
      console.warn("Backend delete plan call handled locally:", e);
    }

    setDeleteConfirm({
      isOpen: false,
      plan: null,
      isLoading: false,
    });
  };

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
      <p className="m-0 mb-[18px] text-[#71757b] text-[16px]">
        Manage your Subscription.
      </p>

      {success && (
        <div style={{ marginBottom: "15px" }}>
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        </div>
      )}

      <div className="grid grid-cols-[repeat(2,minmax(0,360px))] gap-[18px] mt-[18px] max-[900px]:grid-cols-1">
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onDelete={() => requestDeletePlan(plan)}
          />
        ))}
        {!filteredPlans.length && (
          <EmptyState
            label={query ? "No plans match your search" : "No subscription plans"}
          />
        )}
      </div>

      {/* Confirmation Modal for deleting subscription plan */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Subscription Plan"
        message={`Are you sure you want to delete the "${deleteConfirm.plan?.name}" plan? Users currently subscribed will retain access until their period ends.`}
        itemName={deleteConfirm.plan?.name}
        confirmText="Yes, Delete Plan"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
        onConfirm={confirmDeletePlan}
        onCancel={() =>
          setDeleteConfirm({
            isOpen: false,
            plan: null,
            isLoading: false,
          })
        }
      />
    </>
  );
}
export default SubscriptionPlans;
