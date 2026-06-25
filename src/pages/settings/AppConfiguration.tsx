import { useState, useEffect } from "react";
import { RefreshCw, Pencil, Check } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { defaultAppConfig } from "@/data/adminData";
import SettingsToast from "@/components/common/SettingsToast";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function AppConfiguration() {
  const { appConfig, setAppConfig, bannersCopy, setBannersCopy } = useAppData();
  const [draftConfig, setDraftConfig] = useState(appConfig);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [bannerValue, setBannerValue] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setDraftConfig(appConfig);
  }, [appConfig]);

  const handleReset = () => {
    if (window.confirm("Reset all settings to default values?")) {
      setDraftConfig(defaultAppConfig);
      setAppConfig(defaultAppConfig);
      setSuccess("Configurations reset to default values.");
    }
  };

  const handleSave = () => {
    setAppConfig(draftConfig);
    setSuccess("App Configuration updated successfully.");
  };

  const handleDiscard = () => {
    setDraftConfig(appConfig);
    setSuccess("Changes discarded.");
  };

  const handleEditBanner = (key: string, currentValue: string) => {
    setEditingBanner(key);
    setBannerValue(currentValue);
  };

  const handleSaveBanner = (key: string) => {
    setBannersCopy((current) => ({
      ...current,
      [key]: bannerValue.trim(),
    }));
    setEditingBanner(null);
    setSuccess("Banner text updated successfully.");
  };

  const handleCancelBanner = () => {
    setEditingBanner(null);
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #eceef0",
  };

  const labelColStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "3px",
    flex: 1,
  };

  const inputStyle = {
    width: "180px",
    height: "32px",
    border: "1px solid #d7d9dd",
    borderRadius: "4px",
    padding: "0 10px",
    fontSize: "12px",
    textAlign: "right" as const,
    background: "#f7f8fa",
  };

  return (
    <SettingsLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {success && (
          <SettingsToast message={success} onDismiss={() => setSuccess("")} />
        )}

        {/* App Configuration Card */}
        <section
          className="panel"
          style={{ overflow: "hidden", borderRadius: "8px" }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #eceef0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
              App Configuration
            </h3>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "transparent",
                border: "1px solid #d8dadd",
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "11px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <RefreshCw size={11} /> Reset defaults
            </button>
          </div>

          <div>
            {/* Row 1 */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  Free trial length
                </span>
                <span style={{ fontSize: "11px", color: "#8a8d92" }}>
                  Days before trial expires
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#8a8d92",
                  marginRight: "40px",
                }}
              >
                trial_days
              </span>
              <input
                style={inputStyle}
                value={draftConfig.trialDays}
                onChange={(e) =>
                  setDraftConfig((prev) => ({
                    ...prev,
                    trialDays: e.target.value,
                  }))
                }
              />
            </div>

            {/* Row 2 */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  Default household size
                </span>
                <span style={{ fontSize: "11px", color: "#8a8d92" }}>
                  Adults + children
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#8a8d92",
                  marginRight: "40px",
                }}
              >
                default_household
              </span>
              <input
                style={inputStyle}
                value={draftConfig.defaultHousehold}
                onChange={(e) =>
                  setDraftConfig((prev) => ({
                    ...prev,
                    defaultHousehold: e.target.value,
                  }))
                }
              />
            </div>

            {/* Row 3 */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  Meal AI model
                </span>
                <span style={{ fontSize: "11px", color: "#8a8d92" }}>
                  Model used for meal generation
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#8a8d92",
                  marginRight: "40px",
                }}
              >
                ai_model
              </span>
              <input
                style={inputStyle}
                value={draftConfig.aiModel}
                onChange={(e) =>
                  setDraftConfig((prev) => ({
                    ...prev,
                    aiModel: e.target.value,
                  }))
                }
              />
            </div>

            {/* Row 4 */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  Max meal suggestions
                </span>
                <span style={{ fontSize: "11px", color: "#8a8d92" }}>
                  Per meal type per planning session
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#8a8d92",
                  marginRight: "40px",
                }}
              >
                max_suggestions
              </span>
              <input
                style={inputStyle}
                value={draftConfig.maxSuggestions}
                onChange={(e) =>
                  setDraftConfig((prev) => ({
                    ...prev,
                    maxSuggestions: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              background: "#fafbfc",
            }}
          >
            <button
              type="button"
              onClick={handleDiscard}
              className="outline-button"
              style={{ padding: "6px 16px", borderRadius: "4px" }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="dark-button"
              style={{ padding: "6px 16px", borderRadius: "4px" }}
            >
              Save changes
            </button>
          </div>
        </section>

        {/* In-app Banners & Copy Card */}
        <section
          className="panel"
          style={{ overflow: "hidden", borderRadius: "8px" }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #eceef0",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
              In-app Banners & Copy
            </h3>
          </div>

          <div>
            {/* Paywall Headline */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8a8d92",
                    letterSpacing: "0.5px",
                  }}
                >
                  PAYWALL HEADLINE
                </span>
                {editingBanner === "paywallHeadline" ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "4px",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  >
                    <input
                      style={{
                        flex: 1,
                        height: "28px",
                        padding: "0 8px",
                        border: "1px solid #d7d9dd",
                        borderRadius: "4px",
                      }}
                      value={bannerValue}
                      onChange={(e) => setBannerValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveBanner("paywallHeadline")
                      }
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveBanner("paywallHeadline")}
                      style={{
                        padding: "0 8px",
                        background: "#17181a",
                        color: "#fff",
                        border: 0,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelBanner}
                      style={{
                        padding: "0 8px",
                        background: "#e7e8eb",
                        border: 0,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", fontStyle: "italic" }}>
                    "{bannersCopy.paywallHeadline}"
                  </span>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleEditBanner(
                      "paywallHeadline",
                      bannersCopy.paywallHeadline,
                    )
                  }
                  style={{
                    background: "transparent",
                    border: "1px solid #d8dadd",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                >
                  <Pencil size={10} /> Edit
                </button>
                <div
                  style={{
                    background: "#ddfbe8",
                    color: "#1bbd61",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      background: "#1bbd61",
                      borderRadius: "50%",
                    }}
                  />{" "}
                  On
                </div>
              </div>
            </div>

            {/* Onboarding Welcome */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8a8d92",
                    letterSpacing: "0.5px",
                  }}
                >
                  ONBOARDING WELCOME
                </span>
                {editingBanner === "onboardingWelcome" ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "4px",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  >
                    <input
                      style={{
                        flex: 1,
                        height: "28px",
                        padding: "0 8px",
                        border: "1px solid #d7d9dd",
                        borderRadius: "4px",
                      }}
                      value={bannerValue}
                      onChange={(e) => setBannerValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleSaveBanner("onboardingWelcome")
                      }
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveBanner("onboardingWelcome")}
                      style={{
                        padding: "0 8px",
                        background: "#17181a",
                        color: "#fff",
                        border: 0,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelBanner}
                      style={{
                        padding: "0 8px",
                        background: "#e7e8eb",
                        border: 0,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", fontStyle: "italic" }}>
                    "{bannersCopy.onboardingWelcome}"
                  </span>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleEditBanner(
                      "onboardingWelcome",
                      bannersCopy.onboardingWelcome,
                    )
                  }
                  style={{
                    background: "transparent",
                    border: "1px solid #d8dadd",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                >
                  <Pencil size={10} /> Edit
                </button>
                <div
                  style={{
                    background: "#ddfbe8",
                    color: "#1bbd61",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      background: "#1bbd61",
                      borderRadius: "50%",
                    }}
                  />{" "}
                  On
                </div>
              </div>
            </div>

            {/* Plan Complete Message */}
            <div style={rowStyle}>
              <div style={labelColStyle}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8a8d92",
                    letterSpacing: "0.5px",
                  }}
                >
                  PLAN COMPLETE MESSAGE
                </span>
                {editingBanner === "planCompleteMessage" ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "4px",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  >
                    <input
                      style={{
                        flex: 1,
                        height: "28px",
                        padding: "0 8px",
                        border: "1px solid #d7d9dd",
                        borderRadius: "4px",
                      }}
                      value={bannerValue}
                      onChange={(e) => setBannerValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleSaveBanner("planCompleteMessage")
                      }
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveBanner("planCompleteMessage")}
                      style={{
                        padding: "0 8px",
                        background: "#17181a",
                        color: "#fff",
                        border: 0,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelBanner}
                      style={{
                        padding: "0 8px",
                        background: "#e7e8eb",
                        border: 0,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", fontStyle: "italic" }}>
                    "{bannersCopy.planCompleteMessage}"
                  </span>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleEditBanner(
                      "planCompleteMessage",
                      bannersCopy.planCompleteMessage,
                    )
                  }
                  style={{
                    background: "transparent",
                    border: "1px solid #d8dadd",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                >
                  <Pencil size={10} /> Edit
                </button>
                <div
                  style={{
                    background: "#ddfbe8",
                    color: "#1bbd61",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      background: "#1bbd61",
                      borderRadius: "50%",
                    }}
                  />{" "}
                  On
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Landing Page Preview Mockup */}
        <section
          style={{
            textAlign: "center",
            padding: "40px 20px",
            marginTop: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              marginBottom: "8px",
              color: "#111214",
            }}
          >
            Welcome to sizzl
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#686c72",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            A week of meals, planned to your budget.
            <br />
            Create an account to get started.
          </p>
        </section>
      </div>
    </SettingsLayout>
  );
}
export default AppConfiguration;
