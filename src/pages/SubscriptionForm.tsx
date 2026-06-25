import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { initialPlans } from "@/data/adminData";
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
  const [planFeatures, setPlanFeatures] = useState<string[]>(
    existing?.features ?? ["Nutrition tracker", "Advanced analytics"],
  );
  const [error, setError] = useState("");

  const addFeature = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (
      planFeatures.some(
        (feature) => feature.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setError("Feature already exists in list.");
      return;
    }
    setError("");
    setPlanFeatures((current) => [...current, trimmed]);
    setFeatureDraft("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const normalizedPrice = price.replace(/^\$/, "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) {
      setError("Please enter a valid price format (e.g. 19.99)");
      return;
    }

    const cleanedFeatures = planFeatures.map((f) => f.trim()).filter(Boolean);
    if (cleanedFeatures.length === 0) {
      setError("Please add at least one feature.");
      return;
    }

    const plan: SubscriptionPlan = {
      id: existing?.id ?? `${Date.now()}`,
      name: name.trim(),
      price: normalizedPrice,
      duration,
      description: description.trim(),
      features: cleanedFeatures,
    };

    setPlans((current) =>
      existing
        ? current.map((item) => (item.id === existing.id ? plan : item))
        : [...current, plan],
    );

    navigate("/subscription/plans", {
      state: {
        message: edit
          ? "Subscription updated successfully."
          : "Subscription created successfully.",
      },
    });
  };

  return (
    <div className="narrow-page">
      <Link to="/subscription/plans" className="back">
        <ArrowLeft /> {edit ? "Edit Subscription" : "Create Subscription"}
      </Link>
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>{edit ? "Edit Subscription" : "Create Subscription"}</h3>

        {error && (
          <p
            className="form-message error"
            role="alert"
            style={{ marginBottom: "12px" }}
          >
            {error}
          </p>
        )}

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
          <div
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
              marginTop: "4px",
            }}
          >
            <input
              value={featureDraft}
              onChange={(event) => setFeatureDraft(event.target.value)}
              placeholder="e.g. Custom nutrition goals"
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature(featureDraft);
                }
              }}
            />
            <button
              type="button"
              className="dark-button"
              onClick={() => addFeature(featureDraft)}
              style={{ height: "36px", padding: "0 16px", fontSize: "11px" }}
            >
              Add
            </button>
          </div>
        </label>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {planFeatures.map((feature, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "8px",
                width: "100%",
                alignItems: "center",
              }}
            >
              <input
                value={feature}
                onChange={(event) =>
                  setPlanFeatures((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item,
                    ),
                  )
                }
                placeholder="Feature description"
                style={{ flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setPlanFeatures((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#e5484d",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "0 8px",
                  lineHeight: 1,
                }}
                aria-label="Remove feature"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
        />

        <button
          type="button"
          className="outline-button"
          onClick={() => setPlanFeatures((current) => [...current, ""])}
          style={{ width: "100%", marginTop: "4px", marginBottom: "12px" }}
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
