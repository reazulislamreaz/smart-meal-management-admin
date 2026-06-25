import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { avatars } from "@/data/adminData";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function GeneralSettings() {
  const { profile } = useAppData();
  return (
    <SettingsLayout>
      <section className="identity-card settings-identity">
        <div className="identity">
          <img src={avatars[0]} alt="" />
          <div>
            <strong style={{ fontSize: "14px" }}>Khairul Islam</strong>
            <span style={{ color: "#777", fontSize: "11px" }}>{profile.role}</span>
          </div>
        </div>
        <Link
          to="/settings/edit-profile"
          className="dark-button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Pencil size={11} /> Edit Profile
        </Link>
      </section>
      <section className="info-card" style={{ padding: "20px" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600 }}>
          Personal Information
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span
              style={{
                display: "block",
                color: "#666a70",
                fontSize: "11px",
                marginBottom: "4px",
              }}
            >
              User name
            </span>
            <strong style={{ fontSize: "12px", fontWeight: 500 }}>
              {profile.name}
            </strong>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  color: "#666a70",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
              >
                Email
              </span>
              <strong style={{ fontSize: "12px", fontWeight: 500 }}>
                {profile.email}
              </strong>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  color: "#666a70",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
              >
                Phone number
              </span>
              <strong style={{ fontSize: "12px", fontWeight: 500 }}>
                {profile.phone}
              </strong>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  color: "#666a70",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
              >
                Address
              </span>
              <strong style={{ fontSize: "12px", fontWeight: 500 }}>
                {profile.address}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </SettingsLayout>
  );
}
export default GeneralSettings;
