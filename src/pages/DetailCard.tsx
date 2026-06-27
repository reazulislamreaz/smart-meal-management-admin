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
    <div className="max-w-[720px] mx-auto my-[10px] max-[620px]:w-full">
      <Link
        to={earnings ? "/earnings" : "/users"}
        className="flex items-center gap-2 text-[16px] font-bold mb-6 [&_svg]:w-[18px] max-[620px]:text-[14px] max-[620px]:mb-[18px]"
      >
        <ArrowLeft /> User Details
      </Link>

      {/* ── Identity card ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#e5e7ea] rounded-[7px] flex justify-between items-center px-[18px] py-[15px]" style={{ flexDirection: "column", alignItems: "center", gap: "14px", padding: "28px 18px 22px" }}>
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
      <div className="grid grid-cols-2 gap-3 my-[14px] max-[420px]:grid-cols-1" style={{ marginTop: "14px" }}>
        <div className="h-[75px] rounded-[6px] bg-white border border-[#e5e7ea] p-[13px] flex flex-col gap-[7px]">
          <span className="text-[#666a70] text-[12px]">Active Meals</span>
          <strong className="text-[20px]">10</strong>
        </div>
        <div className="h-[75px] rounded-[6px] bg-white border border-[#e5e7ea] p-[13px] flex flex-col gap-[7px]">
          <span className="text-[#666a70] text-[12px]">Total Spend</span>
          <strong className="text-[20px]">$5.00</strong>
        </div>
      </div>

      {/* ── User Information ────────────────────────────────────────── */}
      {!earnings ? (
        <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-[18px] py-[15px]" style={{ marginTop: "14px" }}>
          <h3 className="m-0 mb-4 text-[16px]">User Information</h3>
          <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[420px]:grid-cols-1">
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Name</span>
              <strong className="text-[12px] wrap-anywhere">{user[1]}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Address</span>
              <strong className="text-[12px] wrap-anywhere">{user[4]}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Email</span>
              <strong className="text-[12px] wrap-anywhere">{user[2]}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Phone number</span>
              <strong className="text-[12px] wrap-anywhere">{user[3]}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Joining Date</span>
              <strong className="text-[12px] wrap-anywhere">{joiningDate}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Current plan</span>
              <strong className="text-[12px] wrap-anywhere approved">Annual</strong>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-[18px] py-[15px]" style={{ marginTop: "14px" }}>
          <h3 className="m-0 mb-4 text-[16px]">Subscription Buying Information</h3>
          <div className="grid grid-cols-3 gap-x-5 gap-y-6 max-[620px]:grid-cols-2 max-[420px]:grid-cols-1">
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
              <div className="flex flex-col gap-[5px] min-w-0" key={a}>
                <span className="text-[#666a70] text-[12px]">{a}</span>
                <strong className={`text-[12px] wrap-anywhere${a === "Status" ? " approved" : ""}`}>{b}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export default DetailCard;
