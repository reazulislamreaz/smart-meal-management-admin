import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, X, Eye, ShieldOff, Shield } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { users, avatars } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";

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

  // navbar search takes priority over local search
  const query = topQuery || localSearch.toLowerCase();

  // Combined list with block state
  const allUsers = useMemo(
    () => users.map((u) => ({ data: u, blocked: blockedIds.includes(u[0]) })),
    [blockedIds],
  );

  const displayList = useMemo(() => {
    return allUsers
      .filter((u) => (tab === "blocked" ? u.blocked : true))
      .filter((u) => {
        if (!query) return true;
        return u.data.join(" ").toLowerCase().includes(query);
      })
      .filter((u) => {
        if (!dateFrom && !dateTo) return true;
        const joining = (u.data[5] ?? "").split("\n")[0];
        if (dateFrom && joining < dateFrom) return false;
        if (dateTo && joining > dateTo) return false;
        return true;
      });
  }, [allUsers, tab, query, dateFrom, dateTo]);

  const pageCount = Math.max(1, Math.ceil(displayList.length / pageSize));
  const visible = displayList.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [tab, query, dateFrom, dateTo]);

  const blockedCount = blockedIds.length;
  const hasDateFilter = !!(dateFrom || dateTo);

  const toggleBlock = (id: string) => {
    setBlockedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ─── Toolbar ───────────────────────────────────────────────────────────────
  const toolbar = (
    <div className="ut-toolbar">
      {/* Left: title */}
      <h3 className="ut-title">
        {tab === "blocked" ? "Block User list" : "All User list"}
      </h3>

      {/* Right: controls */}
      <div className="ut-controls">

        {/* Search user */}
        <label className="ut-pill" aria-label="Search users">
          <input
            className="ut-pill__input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search User"
          />
          {localSearch ? (
            <button
              type="button"
              className="ut-pill__icon-btn"
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
          className={`ut-block-pill${tab === "blocked" ? " ut-block-pill--active" : ""}`}
        >
          {tab === "blocked" ? <Shield /> : <ShieldOff />}
          Block User({blockedCount})
        </button>

        {/* Date From */}
        <label className={`ut-pill ut-pill--date${dateFrom ? " ut-pill--filled" : ""}`} aria-label="Filter from date">
          <input
            type="date"
            className="ut-pill__date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
          />
          {/* <span className="ut-pill__icon"><Calendar /></span> */}
        </label>

        <span className="ut-sep">To</span>

        {/* Date To */}
        <label className={`ut-pill ut-pill--date${dateTo ? " ut-pill--filled" : ""}`} aria-label="Filter to date">
          <input
            type="date"
            className="ut-pill__date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
          />
          {/* <span className="ut-pill__icon"><Calendar /></span> */}
        </label>

        {/* Clear date filter */}
        {hasDateFilter && (
          <button
            type="button"
            className="ut-clear-date"
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            title="Clear date filter"
          >
            <X />
          </button>
        )}

        {/* Navbar search active indicator */}
        {topQuery && (
          <span className="ut-nav-badge">
            Searching: "{topQuery}"
          </span>
        )}
      </div>
    </div>
  );

  // ─── Table ─────────────────────────────────────────────────────────────────
  return (
    <section className="table-panel" style={{ marginTop: "15px" }}>
      {toolbar}
      <table>
        <thead>
          <tr>
            {["No", "User Name", "Email", "Phone Number", "Address", "Joining Date", "Action"].map(
              (h) => <th key={h}>{h}</th>,
            )}
          </tr>
        </thead>
        <tbody>
          {visible.map((u, i) => {
            const idx = (page - 1) * pageSize + i;
            const user = u.data;
            const avatarIdx = parseInt(user[0], 10) - 1;
            const joinDate = user[5] ?? "";
            const parts = joinDate.split("\n");
            const datePart = parts[0] ?? "";
            const timePart = parts[1] ?? "";
            const displayNo = String(idx + 1).padStart(2, "0");

            return (
              <tr key={user[0]}>
                <td style={{ color: "#777", fontSize: "10px" }}>{displayNo}</td>
                <td>
                  <div className="user-cell">
                    <img src={avatars[avatarIdx % avatars.length]} alt="" />
                    <strong>{user[1]}</strong>
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
                  <div className="row-actions-group">
                    {/* View Details */}
                    <Link
                      to={`/users/${user[0]}`}
                      className="action-view-btn"
                      title="View Details"
                    >
                      <Eye />
                      <span>View</span>
                    </Link>

                    {/* Block / Unblock */}
                    <button
                      type="button"
                      onClick={() => toggleBlock(user[0])}
                      className={`action-block-btn${u.blocked ? " action-block-btn--blocked" : ""}`}
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
    </section>
  );
}
export default UserTable;
