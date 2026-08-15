import { useState, useMemo, useEffect } from "react";
import { X, Eye, ShieldOff, Shield } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { users as defaultUsers, avatars } from "@/data/adminData";
import { adminApi, type AdminUserItem } from "@/lib/adminApi";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import UserAvatar from "@/components/common/UserAvatar";

// ─── Default blocked user IDs ──────────────────────────────────────────────
const DEFAULT_BLOCKED: string[] = ["03", "05"];

// ─── Main Component ─────────────────────────────────────────────────────────
export function UserTable() {
  const [searchParams] = useSearchParams();
  // top-bar navbar search (URL ?q=)
  const topQuery = (searchParams.get("q") ?? "").toLowerCase();

  const [blockedIds, setBlockedIds] = useStoredState<string[]>(
    "sizzl-blocked-users",
    DEFAULT_BLOCKED,
  );

  const [tab, setTab] = useState<"all" | "blocked">("all");
  const [localSearch, setLocalSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  // Confirm block modal state
  const [blockConfirm, setBlockConfirm] = useState<{
    isOpen: boolean;
    id: string;
    rawId?: string;
    userName: string;
    isBlocked: boolean;
    isLoading: boolean;
  }>({
    isOpen: false,
    id: "",
    userName: "",
    isBlocked: false,
    isLoading: false,
  });

  // navbar search takes priority over local search
  const query = topQuery || localSearch.toLowerCase();

  // Local fallback users state
  const [apiUsers, setApiUsers] = useState<AdminUserItem[]>([]);
  const [useApi, setUseApi] = useState(false);

  // Debounced search query for fast UI response
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 180);
    return () => clearTimeout(handler);
  }, [query]);

  const fetchUsers = () => {
    adminApi
      .getUsers({
        search: debouncedQuery,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        isBlocked: tab === "blocked" ? true : undefined,
        limit: 100,
      })
      .then((res: any) => {
        const list: AdminUserItem[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        if (list.length > 0) {
          setApiUsers(list);
          setUseApi(true);
        }
      })
      .catch((err) => {
        console.warn("Could not load users from backend, using fallback dataset:", err.message);
        setUseApi(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedQuery, tab, dateFrom, dateTo]);

  // Combined fallback list with block state
  const fallbackUsers = useMemo(
    () =>
      defaultUsers.map((u, i) => ({
        data: u,
        blocked: blockedIds.includes(u[0]),
        avatar: avatars[i % avatars.length],
      })),
    [blockedIds],
  );

  const displayList = useMemo(() => {
    if (useApi && apiUsers.length > 0) {
      return apiUsers.map((u) => ({
        data: [
          u.no || u.id,
          u.name,
          u.email,
          u.phoneNumber,
          u.address,
          `${u.joiningDate}\n${u.joiningTime || ""}`,
        ],
        rawId: u.id,
        avatar: u.avatar,
        blocked: !!u.isBlocked || blockedIds.includes(u.id) || blockedIds.includes(u.no),
      }));
    }

    return fallbackUsers
      .filter((u) => (tab === "blocked" ? u.blocked : true))
      .filter((u) => {
        if (!query) return true;
        return u.data.join(" ").toLowerCase().includes(query);
      })
      .filter((u) => {
        if (!dateFrom && !dateTo) return true;
        const raw = u.data[5]?.split("\n")[0];
        if (!raw) return true;
        if (dateFrom && raw < dateFrom) return false;
        if (dateTo && raw > dateTo) return false;
        return true;
      })
      .map((u) => ({ ...u, rawId: u.data[0] }));
  }, [useApi, apiUsers, fallbackUsers, tab, query, dateFrom, dateTo, blockedIds]);

  const pageCount = Math.max(1, Math.ceil(displayList.length / pageSize));
  const visible = displayList.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [tab, query, dateFrom, dateTo]);

  const blockedCount = displayList.filter((u) => u.blocked).length || blockedIds.length;
  const hasDateFilter = !!(dateFrom || dateTo);

  const handleToggleBlockClick = (id: string, rawId?: string, userName = "User", isCurrentlyBlocked = false) => {
    if (!isCurrentlyBlocked) {
      setBlockConfirm({
        isOpen: true,
        id,
        rawId,
        userName,
        isBlocked: false,
        isLoading: false,
      });
    } else {
      executeToggleBlock(id, rawId, true);
    }
  };

  const executeToggleBlock = async (id: string, rawId?: string, isCurrentlyBlocked = false) => {
    const targetId = rawId || id;
    setBlockConfirm((prev) => ({ ...prev, isLoading: true }));

    setBlockedIds((prev) =>
      prev.includes(id) || prev.includes(targetId)
        ? prev.filter((x) => x !== id && x !== targetId)
        : [...prev, id],
    );

    // Call backend API if possible
    try {
      await adminApi.toggleUserBlock(targetId, !isCurrentlyBlocked);
      fetchUsers();
    } catch (e) {
      console.warn("Backend toggleUserBlock call handled locally:", e);
    }

    setBlockConfirm({
      isOpen: false,
      id: "",
      userName: "",
      isBlocked: false,
      isLoading: false,
    });
  };

  // ─── Shared class strings ────────────────────────────────────────────────
  const pillInput =
    "border-0 outline-0 p-0 h-auto bg-transparent shadow-none text-[#27292c] text-[11px] w-[110px] min-w-0 placeholder:text-[#9a9da2]";
  const pillIconBtn =
    "grid place-items-center w-4 h-4 border-0 rounded-full bg-[#e7e8eb] text-[#555] p-0 cursor-pointer shrink-0 transition-[background,color] duration-130 hover:bg-[#ff5361] hover:text-white [&_svg]:w-[10px] [&_svg]:h-[10px]";
  const datePill = (filled: boolean) =>
    `inline-flex flex-row items-center gap-[6px] h-[30px] px-[11px] border rounded-[15px] bg-white cursor-pointer transition-[border-color,box-shadow] duration-150 focus-within:border-[#17181a] focus-within:shadow-[0_0_0_2px_rgba(23,24,26,.08)] ${filled ? "border-[#17181a]" : "border-[#d1d4d9]"}`;
  const dateInput =
    "border-0 outline-0 bg-transparent text-[#27292c] text-[11px] w-[100px] p-0 h-auto shadow-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-45 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-[13px]";

  // ─── Toolbar ───────────────────────────────────────────────────────────────
  const toolbar = (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-[10px] flex-wrap px-[14px] py-2 bg-[#f0f1f3] border-b border-[#dfe1e5] rounded-t-[7px] min-h-[46px]">
      {/* Left: title */}
      <h3 className="m-0 text-[13px] font-bold text-[#17181a] whitespace-nowrap">
        {tab === "blocked" ? "Block User list" : "All User list"}
      </h3>

      {/* Right: controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search user */}
        <label
          className="inline-flex flex-row items-center gap-[6px] h-[30px] px-[11px] border border-[#d1d4d9] rounded-[15px] bg-white cursor-text transition-[border-color,box-shadow] duration-150 focus-within:border-[#17181a] focus-within:shadow-[0_0_0_2px_rgba(23,24,26,.08)]"
          aria-label="Search users"
        >
          <input
            className={pillInput}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search User"
          />
          {localSearch ? (
            <button
              type="button"
              className={pillIconBtn}
              onClick={() => setLocalSearch("")}
              title="Clear search"
            >
              <X />
            </button>
          ) : (
            ""
          )}
        </label>

        {/* Block User toggle */}
        <button
          type="button"
          onClick={() => setTab((t) => (t === "blocked" ? "all" : "blocked"))}
          className={`inline-flex items-center gap-[5px] h-[30px] px-[13px] border rounded-[15px] text-white text-[11px] font-semibold cursor-pointer transition-[background,border-color] duration-130 whitespace-nowrap [&_svg]:w-3 [&_svg]:h-3 ${tab === "blocked" ? "bg-[#ff5361] border-[#ff5361] hover:bg-[#e8404e] hover:border-[#e8404e]" : "bg-[#17181a] border-[#d1d4d9] hover:bg-[#2e3035]"}`}
        >
          {tab === "blocked" ? <Shield /> : <ShieldOff />}
          Block User({blockedCount})
        </button>

        {/* Date From */}
        <label className={datePill(!!dateFrom)} aria-label="Filter from date">
          <input
            type="date"
            className={dateInput}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
          />
        </label>

        <span className="text-[11px] text-[#8a8d92] shrink-0 font-medium">To</span>

        {/* Date To */}
        <label className={datePill(!!dateTo)} aria-label="Filter to date">
          <input
            type="date"
            className={dateInput}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
          />
        </label>

        {/* Clear date filter */}
        {hasDateFilter && (
          <button
            type="button"
            className="grid place-items-center w-[22px] h-[22px] border border-[#dfe1e4] rounded-full bg-white text-[#8a8d92] p-0 cursor-pointer transition-[background,color,border-color] duration-130 hover:bg-[#ff5361] hover:border-[#ff5361] hover:text-white [&_svg]:w-[11px] [&_svg]:h-[11px]"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            title="Clear date filter"
          >
            <X />
          </button>
        )}

        {/* Navbar search active indicator */}
        {topQuery && (
          <span className="inline-flex items-center h-[22px] px-[9px] rounded-[11px] bg-[#eff6ff] text-[#2563eb] text-[10px] font-semibold border border-[#bfdbfe] whitespace-nowrap animate-[fadeIn_.2s_ease]">
            Searching: "{topQuery}"
          </span>
        )}
      </div>
    </div>
  );

  // ─── Table ─────────────────────────────────────────────────────────────────
  return (
    <section
      className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full mt-[15px] overflow-x-auto overflow-y-hidden"
      style={{ marginTop: "15px" }}
    >
      {toolbar}
      <table>
        <thead>
          <tr>
            {["No", "User Name", "Email", "Phone Number", "Address", "Joining Date", "Action"].map(
              (h) => (
                <th key={h}>{h}</th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {visible.map((u, i) => {
            const idx = (page - 1) * pageSize + i;
            const user = u.data;
            const avatarIdx = parseInt(user[0], 10) - 1 || i;
            const joinDate = user[5] ?? "";
            const parts = joinDate.split("\n");
            const datePart = parts[0] ?? "";
            const timePart = parts[1] ?? "";
            const displayNo = String(idx + 1).padStart(2, "0");

            return (
              <tr key={user[0] + i}>
                <td style={{ color: "#777", fontSize: "10px" }}>{displayNo}</td>
                <td>
                  <div className="flex items-center gap-[7px]">
                    <UserAvatar
                      src={u.avatar || avatars[Math.abs(avatarIdx) % avatars.length]}
                      name={user[1]}
                      fallbackIndex={avatarIdx}
                      className="w-[22px] h-[22px] rounded-full object-cover"
                    />
                    <strong className="font-medium">{user[1]}</strong>
                  </div>
                </td>
                <td>{user[2]}</td>
                <td>{user[3]}</td>
                <td>{user[4]}</td>
                <td>
                  {datePart}
                  {timePart && (
                    <>
                      <br />
                      <small>{timePart}</small>
                    </>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-[6px]">
                    {/* View Details */}
                    <Link
                      to={`/users/${u.rawId || user[0]}`}
                      className="inline-flex items-center gap-1 h-[27px] px-[10px] rounded-[13px] border border-[#d0d3d8] bg-white text-[#34363a] text-[10px] font-semibold no-underline whitespace-nowrap cursor-pointer transition-[background,border-color,color,box-shadow] duration-140 hover:bg-[#17181a] hover:border-[#17181a] hover:text-white hover:shadow-[0_2px_8px_rgba(23,24,26,.2)] [&_svg]:w-[11px] [&_svg]:h-[11px]"
                      title="View Details"
                    >
                      <Eye />
                      <span>View</span>
                    </Link>

                    {/* Block / Unblock */}
                    <button
                      type="button"
                      onClick={() => handleToggleBlockClick(user[0], u.rawId, user[1], u.blocked)}
                      className={`inline-flex items-center gap-1 h-[27px] px-[10px] rounded-[13px] border text-[10px] font-semibold cursor-pointer whitespace-nowrap transition-[background,border-color,color] duration-140 [&_svg]:w-[11px] [&_svg]:h-[11px] ${u.blocked ? "bg-[#1a1c1f] border-[#1a1c1f] text-white hover:bg-[#ff5361] hover:border-[#ff5361] hover:text-white" : "border-[#e5e7ea] bg-[#f5f6f8] text-[#52565b] hover:bg-[#ffe5e8] hover:border-[#ffb3b8] hover:text-[#e5484d]"}`}
                      title={u.blocked ? "Unblock user" : "Block user"}
                    >
                      {u.blocked ? <Shield /> : <ShieldOff />}
                      <span>{u.blocked ? "Unblock" : "Block"}</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {!visible.length && (
            <tr>
              <td colSpan={7}>
                <EmptyState
                  label={tab === "blocked" ? "No blocked users" : "No users found"}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        page={page}
        pageCount={pageCount}
        totalItems={displayList.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {/* Confirmation Modal for blocking user */}
      <ConfirmModal
        isOpen={blockConfirm.isOpen}
        title="Block User Account"
        message={`Are you sure you want to block ${blockConfirm.userName}? Their account access will be suspended and they will not be able to log in or generate meal plans.`}
        itemName={blockConfirm.userName}
        confirmText="Yes, Block User"
        cancelText="Cancel"
        variant="danger"
        isLoading={blockConfirm.isLoading}
        onConfirm={() => executeToggleBlock(blockConfirm.id, blockConfirm.rawId, false)}
        onCancel={() =>
          setBlockConfirm({
            isOpen: false,
            id: "",
            userName: "",
            isBlocked: false,
            isLoading: false,
          })
        }
      />
    </section>
  );
}
export default UserTable;
