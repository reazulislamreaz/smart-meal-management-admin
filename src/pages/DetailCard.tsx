import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { users, avatars } from "@/data/adminData";

export function DetailCard({ earnings = false }: { earnings?: boolean }) {
  const { id } = useParams();
  const user = users.find((item) => item[0] === id) ?? users[0];
  const avatarIdx = (Number(user[0]) - 1) % avatars.length;

  const [blockedIds, setBlockedIds] = useStoredState<string[]>(
    "sizzl-blocked-users",
    ["03", "05"],
  );
  const isBlocked = blockedIds.includes(user[0]);

  const toggleBlock = () => {
    setBlockedIds((prev) =>
      prev.includes(user[0])
        ? prev.filter((x) => x !== user[0])
        : [...prev, user[0]],
    );
  };

  const joiningDate = (user[5] ?? "").split("\n")[0];

  return (
    <div className="details-wrap">
      <Link to={earnings ? "/earnings" : "/users"} className="back">
        <ArrowLeft /> User Details
      </Link>

      {/* ── Identity card ───────────────────────────────────────────── */}
      <div className="identity-card" style={{ flexDirection: "column", alignItems: "center", gap: "14px", padding: "28px 18px 22px" }}>
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <img
            src={avatars[avatarIdx]}
            alt={user[1]}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          />
          {/* Active green dot */}
          <span
            style={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #fff",
            }}
          />
        </div>

        {/* Name + badge */}
        <div style={{ textAlign: "center" }}>
          <strong style={{ fontSize: "16px", display: "block", marginBottom: "8px" }}>
            {user[1]}
          </strong>
          <span
            style={{
              display: "inline-block",
              background: isBlocked ? "#ffe5e8" : "#ffe5e8",
              color: isBlocked ? "#e5484d" : "#e5484d",
              borderRadius: "12px",
              padding: "3px 14px",
              fontSize: "9px",
              fontWeight: 600,
            }}
          >
            {isBlocked ? "Blocked" : "Active"}
          </span>
        </div>

        {/* Block / Unblock button */}
        {!earnings && (
          <button
            type="button"
            onClick={toggleBlock}
            style={{
              border: 0,
              borderRadius: "16px",
              padding: "7px 20px",
              fontSize: "9px",
              fontWeight: 600,
              cursor: "pointer",
              background: isBlocked ? "#17181a" : "#ff5361",
              color: "#fff",
            }}
          >
            {isBlocked ? "Unblock User" : "Block User"}
          </button>
        )}
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="detail-stats" style={{ marginTop: "14px" }}>
        <div>
          <span>Active Meals</span>
          <strong>10</strong>
        </div>
        <div>
          <span>Total Spend</span>
          <strong>$5.00</strong>
        </div>
      </div>

      {/* ── User Information ────────────────────────────────────────── */}
      {!earnings ? (
        <section className="info-card" style={{ marginTop: "14px" }}>
          <h3>User Information</h3>
          <div className="info-grid">
            <div>
              <span>Name</span>
              <strong>{user[1]}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{user[4]}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user[2]}</strong>
            </div>
            <div>
              <span>Phone number</span>
              <strong>{user[3]}</strong>
            </div>
            <div>
              <span>Joining Date</span>
              <strong>{joiningDate}</strong>
            </div>
            <div>
              <span>Current plan</span>
              <strong className="approved">Annual</strong>
            </div>
          </div>
        </section>
      ) : (
        <section className="info-card" style={{ marginTop: "14px" }}>
          <h3>Subscription Buying Information</h3>
          <div className="info-grid three">
            {[
              ["Subscription Type", "Annual"],
              ["Buying date", "12/12/24"],
              ["Current Period Start Date", "15 Feb 2025"],
              ["Transaction ID", "TXN1454"],
              ["Withdraw Amount", "$120"],
              ["Subscription Expired", "15 Jan 2026"],
              ["Current Plan Meal ID", "Trial"],
              ["Card Type", "Visa/Pay"],
              ["Status", "Approved"],
            ].map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <strong className={a === "Status" ? "approved" : ""}>{b}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export default DetailCard;
