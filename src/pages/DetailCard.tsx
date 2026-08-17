import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { users, avatars } from "@/data/adminData";
import { adminApi, type AdminUserDetails } from "@/lib/adminApi";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import UserAvatar from "@/components/common/UserAvatar";

export function DetailCard({ earnings = false }: { earnings?: boolean }) {
  const { id } = useParams();
  const fallbackUser = users.find((item) => item[0] === id) ?? users[0];
  const avatarIdx = (Number(fallbackUser[0]) - 1 || 0) % avatars.length;

  const [apiUser, setApiUser] = useState<AdminUserDetails | null>(null);

  const [blockedIds, setBlockedIds] = useStoredState<string[]>(
    "sizzl-blocked-users",
    ["03", "05"],
  );

  // Confirm action modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      adminApi
        .getUserDetails(id)
        .then((data) => {
          if (isMounted && data) {
            setApiUser(data);
          }
        })
        .catch((err) => {
          console.warn("Could not load user details from backend:", err.message);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const targetId = id || fallbackUser[0];
  const isBlocked =
    apiUser?.isBlocked !== undefined
      ? apiUser.isBlocked
      : blockedIds.includes(targetId) || blockedIds.includes(fallbackUser[0]);

  const requestToggleBlock = () => {
    if (!isBlocked) {
      setConfirmOpen(true);
    } else {
      executeToggleBlock();
    }
  };

  const executeToggleBlock = async () => {
    const nextBlocked = !isBlocked;
    setConfirmLoading(true);

    setBlockedIds((prev) =>
      prev.includes(targetId)
        ? prev.filter((x) => x !== targetId)
        : [...prev, targetId],
    );

    if (apiUser) {
      setApiUser({ ...apiUser, isBlocked: nextBlocked });
    }

    try {
      await adminApi.toggleUserBlock(targetId, nextBlocked);
    } catch (e) {
      console.warn("Backend toggleUserBlock call handled locally:", e);
    }

    setConfirmLoading(false);
    setConfirmOpen(false);
  };

  const displayName = apiUser?.name || fallbackUser[1];
  const displayAddress = apiUser?.address || fallbackUser[4];
  const displayEmail = apiUser?.email || fallbackUser[2];
  const displayPhone = apiUser?.phoneNumber || fallbackUser[3];
  const displayJoiningDate = apiUser?.joiningDate || (fallbackUser[5] ?? "").split("\n")[0];
  const displayPlan = apiUser?.currentPlan || "Annual";
  const displayAvatar = apiUser?.avatar || avatars[avatarIdx];
  const activeMeals = apiUser?.activeMeals ?? 10;
  const totalSpend = apiUser?.totalSpend ?? "$5.00";

  return (
    <div className="max-w-[720px] mx-auto my-[10px] max-[620px]:w-full">
      <Link
        to={earnings ? "/earnings" : "/users"}
        className="flex items-center gap-2 text-[16px] font-bold mb-6 [&_svg]:w-[18px] max-[620px]:text-[14px] max-[620px]:mb-[18px]"
      >
        <ArrowLeft /> User Details
      </Link>

      {/* ── Identity card ───────────────────────────────────────────── */}
      <div
        className="bg-white border border-[#e5e7ea] rounded-[7px] flex justify-between items-center px-[18px] py-[15px]"
        style={{ flexDirection: "column", alignItems: "center", gap: "14px", padding: "28px 18px 22px" }}
      >
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <UserAvatar
            src={displayAvatar}
            name={displayName}
            fallbackIndex={avatarIdx}
            size={180}
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
              background: isBlocked ? "#ef4444" : "#22c55e",
              border: "2px solid #fff",
            }}
          />
        </div>

        {/* Name + badge */}
        <div style={{ textAlign: "center" }}>
          <strong style={{ fontSize: "16px", display: "block", marginBottom: "8px" }}>
            {displayName}
          </strong>
          <span
            style={{
              display: "inline-block",
              background: isBlocked ? "#ffe5e8" : "#e3f9eb",
              color: isBlocked ? "#e5484d" : "#22a65b",
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
            onClick={requestToggleBlock}
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
          <strong className="text-[20px]">{activeMeals}</strong>
        </div>
        <div className="h-[75px] rounded-[6px] bg-white border border-[#e5e7ea] p-[13px] flex flex-col gap-[7px]">
          <span className="text-[#666a70] text-[12px]">Total Spend</span>
          <strong className="text-[20px]">{totalSpend}</strong>
        </div>
      </div>

      {/* ── User Information ────────────────────────────────────────── */}
      {!earnings ? (
        <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-[18px] py-[15px]" style={{ marginTop: "14px" }}>
          <h3 className="m-0 mb-4 text-[16px] font-bold">User Information</h3>
          <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[420px]:grid-cols-1">
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Name</span>
              <strong className="text-[12px] wrap-anywhere">{displayName}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Address</span>
              <strong className="text-[12px] wrap-anywhere">{displayAddress}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Email</span>
              <strong className="text-[12px] wrap-anywhere">{displayEmail}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Phone number</span>
              <strong className="text-[12px] wrap-anywhere">{displayPhone}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Joining Date</span>
              <strong className="text-[12px] wrap-anywhere">{displayJoiningDate}</strong>
            </div>
            <div className="flex flex-col gap-[5px] min-w-0">
              <span className="text-[#666a70] text-[12px]">Current plan</span>
              <strong className="text-[12px] wrap-anywhere approved">{displayPlan}</strong>
            </div>
          </div>

          {/* Household Tasks Section */}
          {apiUser?.tasks && apiUser.tasks.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#edf0f2]">
              <h4 className="m-0 mb-3 text-[14px] font-semibold text-[#17181a]">
                Household Tasks & Chores ({apiUser.tasks.length})
              </h4>
              <div className="flex flex-col gap-2">
                {apiUser.tasks.map((task: any, idx: number) => (
                  <div
                    key={task.id || idx}
                    className="flex items-center justify-between gap-3 p-3 bg-[#f8f9fa] border border-[#e5e7ea] rounded-[6px]"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <strong className="text-[13px] font-medium text-[#27292c]">
                        {task.title}
                      </strong>
                      {task.description && (
                        <p className="m-0 text-[11px] text-[#666a70]">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-[10px] shrink-0 ${
                        task.status === "COMPLETED"
                          ? "bg-[#e6f7ef] text-[#059669]"
                          : task.status === "IN_PROGRESS"
                            ? "bg-[#eff6ff] text-[#2563eb]"
                            : "bg-[#fff7ed] text-[#ea580c]"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white border border-[#e5e7ea] rounded-[7px] px-[18px] py-[15px]" style={{ marginTop: "14px" }}>
          <h3 className="m-0 mb-4 text-[16px] font-bold">Subscription Buying Information</h3>
          <div className="grid grid-cols-3 gap-x-5 gap-y-6 max-[620px]:grid-cols-2 max-[420px]:grid-cols-1">
            {[
              ["Subscription Type", apiUser?.subscriptions?.[0]?.planName || displayPlan],
              [
                "Buying date",
                apiUser?.subscriptions?.[0]?.createdAt
                  ? new Date(apiUser.subscriptions[0].createdAt).toLocaleDateString()
                  : displayJoiningDate,
              ],
              [
                "Current Period Start Date",
                apiUser?.subscriptions?.[0]?.currentPeriodStart
                  ? new Date(apiUser.subscriptions[0].currentPeriodStart).toLocaleDateString()
                  : displayJoiningDate,
              ],
              [
                "Transaction ID",
                apiUser?.subscriptions?.[0]?.stripePaymentIntentId ||
                  apiUser?.subscriptions?.[0]?.stripeSubscriptionId ||
                  `TXN${targetId.slice(0, 6).toUpperCase()}`,
              ],
              [
                "Withdraw Amount",
                apiUser?.subscriptions?.[0]?.planName?.toLowerCase().includes("annual")
                  ? "$59.88"
                  : "$7.99",
              ],
              [
                "Subscription Expired",
                apiUser?.subscriptions?.[0]?.currentPeriodEnd
                  ? new Date(apiUser.subscriptions[0].currentPeriodEnd).toLocaleDateString()
                  : "Active (Auto-renew)",
              ],
              ["Current Plan Meal ID", apiUser?.subscriptions?.[0]?.planName || "Standard"],
              ["Card Type", "Visa / Stripe"],
              ["Status", apiUser?.subscriptions?.[0]?.status || "Approved"],
            ].map(([a, b]) => (
              <div className="flex flex-col gap-[5px] min-w-0" key={a}>
                <span className="text-[#666a70] text-[12px]">{a}</span>
                <strong className={`text-[12px] wrap-anywhere${a === "Status" ? " approved" : ""}`}>{b}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmation Modal for blocking user */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Block User Account"
        message={`Are you sure you want to block ${displayName}? Their platform access will be suspended and active meal planning subscriptions will be paused.`}
        itemName={displayName}
        confirmText="Yes, Block User"
        cancelText="Cancel"
        variant="danger"
        isLoading={confirmLoading}
        onConfirm={executeToggleBlock}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
export default DetailCard;
