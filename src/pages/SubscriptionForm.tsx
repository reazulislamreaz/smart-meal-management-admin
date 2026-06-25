import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { initialPlans, features } from "@/data/adminData";
import type { SubscriptionPlan } from "@/types/admin";

export function SubscriptionForm({ edit = false }: { edit?: boolean }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [plans, setPlans] = useStoredState("sizzl-plans", initialPlans);
  const existing = edit
    ? (plans.find((plan) => plan.id === id) ?? plans[0])
    : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [price, setPrice] = useState(existing?.price ?? "");
  const [duration, setDuration] = useState<"monthly" | "annual">(
    existing?.duration ?? "monthly",
  );
  const [description, setDescription] = useState(existing?.description ?? "");
  const [featureDraft, setFeatureDraft] = useState("");
  const [planFeatures, setPlanFeatures] = useState(existing?.features ?? []);

  const addFeature = (value: string) => {
    const trimmed = value.trim();
    if (
      !trimmed ||
      planFeatures.some(
        (feature) => feature.toLowerCase() === trimmed.toLowerCase(),
      )
    )
      return;
    setPlanFeatures((current) => [...current, trimmed]);
    setFeatureDraft("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedPrice = price.replace(/^\$/, "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) return;
    const plan: SubscriptionPlan = {
      id: existing?.id ?? `${Date.now()}`,
      name: name.trim(),
      price: normalizedPrice,
      duration,
      description: description.trim(),
      features: planFeatures,
    };
    setPlans((current) =>
      existing
        ? current.map((item) => (item.id === existing.id ? plan : item))
        : [...current, plan],
    );
    alert(
      edit
        ? "Subscription updated successfully."
        : "Subscription created successfully.",
    );
    navigate("/subscription/plans");
  };

  return (
    <div className="narrow-page">
      <Link to="/subscription/plans" className="back">
        <ArrowLeft /> {edit ? "Edit Subscription" : "Create Subscription"}
      </Link>
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>{edit ? "Edit Subscription" : "Create Subscription"}</h3>
        <label>
          Subscription Plan Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Subscription Plan Name"
            required
          />
        </label>
        <label>
          Subscription Price
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            placeholder="29.99"
            required
          />
        </label>
        <label>
          Duration
          <select
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value as "monthly" | "annual")
            }
            required
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </label>
        <label className="feature-label">
          Features
          <select
            value={featureDraft}
            onChange={(event) => {
              const value = event.target.value;
              setFeatureDraft(value);
              if (value) addFeature(value);
            }}
          >
            <option value="">Select feature</option>
            {features.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
        </label>
        <input
          value={planFeatures[0] ?? ""}
          onChange={(event) =>
            setPlanFeatures((current) => [
              event.target.value,
              ...current.slice(1),
            ])
          }
          placeholder="Nutrition tracker"
        />
        <input
          value={planFeatures[1] ?? ""}
          onChange={(event) =>
            setPlanFeatures((current) => [
              current[0] ?? "",
              event.target.value,
              ...current.slice(2),
            ])
          }
          placeholder="Advanced analytics"
        />
        {planFeatures.slice(2).map((feature, index) => (
          <input
            key={index + 2}
            value={feature}
            onChange={(event) =>
              setPlanFeatures((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index + 2 ? event.target.value : item,
                ),
              )
            }
            placeholder="Feature"
          />
        ))}
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
        />
        <button
          type="button"
          className="outline-button"
          onClick={() => setPlanFeatures((current) => [...current, ""])}
        >
          + Add More
        </button>
        <button type="submit" className="dark-button wide">
          {edit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
export default SubscriptionForm;
