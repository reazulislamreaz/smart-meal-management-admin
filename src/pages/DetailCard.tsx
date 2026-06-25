import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { users, avatars } from "@/data/adminData";

export function DetailCard({ earnings = false }: { earnings?: boolean }) {
  const { id } = useParams();
  const user = users.find((item) => item[0] === id) ?? users[0];
  const [blocked, setBlocked] = useState(false);
  return (
    <div className="details-wrap">
      <Link to={earnings ? "/earnings" : "/users"} className="back">
        <ArrowLeft /> User Details
      </Link>
      <div className="identity-card">
        <div className="identity">
          <img src={avatars[(Number(user[0]) - 1) % avatars.length]} alt="" />
          <div>
            <strong>{user[1]}</strong>
            <span>{earnings ? "" : "Member"}</span>
          </div>
        </div>
        {!earnings && (
          <button
            type="button"
            className="danger-pill"
            onClick={() => setBlocked((value) => !value)}
          >
            {blocked ? "Unblock User" : "Block User"}
          </button>
        )}
      </div>
      {earnings ? (
        <section className="info-card">
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
                <strong className={a === "Status" ? "approved" : ""}>
                  {b}
                </strong>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <div className="detail-stats">
            <div>
              <span>Active Meals</span>
              <strong>12</strong>
            </div>
            <div>
              <span>Total Spend</span>
              <strong>$ 350</strong>
            </div>
          </div>
          <section className="info-card">
            <h3>User Information</h3>
            <div className="info-grid">
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
                <strong>{user[5]}</strong>
              </div>
              <div>
                <span>Current plan</span>
                <strong className="approved">Annual</strong>
              </div>
            </div>
          </section>
        </>
      )}
      {earnings && (
        <div className="detail-stats">
          <div>
            <span>Active Meals</span>
            <strong>21</strong>
          </div>
          <div>
            <span>Total Spend</span>
            <strong>$ 350</strong>
          </div>
        </div>
      )}
    </div>
  );
}
export default DetailCard;
