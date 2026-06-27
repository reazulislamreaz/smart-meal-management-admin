import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useStoredState } from "@/hooks/useStoredState";
import { users, avatars } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";

// ─── Default blocked user IDs ──────────────────────────────────────────────
const DEFAULT_BLOCKED: string[] = ["03", "05"];

// ─── Main Component ─────────────────────────────────────────────────────────
export function UserTable() {
  const [searchParams] = useSearchParams();
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

  const query = topQuery || localSearch.toLowerCase();

  // Combined list with block state
  const allUsers = useMemo(
    () =>
      users.map((u) => ({ data: u, blocked: blockedIds.includes(u[0]) })),
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
        const joining = (u.data[5] ?? "").split("\n")[0]; // only date part "2025-03-12"
        if (dateFrom && joining < dateFrom) return false;
        if (dateTo && joining > dateTo) return false;
        return true;
      });
  }, [allUsers, tab, query, dateFrom, dateTo]);

  const pageCount = Math.max(1, Math.ceil(displayList.length / pageSize));
  const visible = displayList.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [tab, query, dateFrom, dateTo]);

  const blockedCount = blockedIds.length;

  const toggleBlock = (id: string) => {
    setBlockedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ─── Toolbar ───────────────────────────────────────────────────────────────
  const toolbar = (
    <div
      className="table-toolbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        flexWrap: "wrap",
        padding: "10px 14px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
        {tab === "blocked" ? "Block User list" : "All User list"}
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {/* Search pill */}
        <label
          className="searchbox small"
          style={{ height: "30px", width: "160px", minWidth: "120px" }}
        >
          <Search />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search User"
          />
          {localSearch && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setLocalSearch("")}
            >
              <X />
            </button>
          )}
        </label>

        {/* Block User tab pill */}
        <button
          type="button"
          onClick={() => setTab((t) => (t === "blocked" ? "all" : "blocked"))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "30px",
            padding: "0 14px",
            border: 0,
            borderRadius: "15px",
            background: tab === "blocked" ? "#17181a" : "#17181a",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          Block User({blockedCount})
        </button>

        {/* Date From */}
        <label
          className="searchbox small"
          style={{ height: "30px", width: "130px", minWidth: "100px", gap: "6px" }}
        >
          <Calendar style={{ width: "13px", flexShrink: 0 }} />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ fontSize: "9px", padding: 0, border: 0, background: "transparent", outline: 0, width: "100%", color: dateFrom ? "#333" : "#686c72" }}
          />
        </label>

        <span style={{ fontSize: "9px", color: "#686c72" }}>To</span>

        {/* Date To */}
        <label
          className="searchbox small"
          style={{ height: "30px", width: "130px", minWidth: "100px", gap: "6px" }}
        >
          <Calendar style={{ width: "13px", flexShrink: 0 }} />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ fontSize: "9px", padding: 0, border: 0, background: "transparent", outline: 0, width: "100%", color: dateTo ? "#333" : "#686c72" }}
          />
        </label>

        {(dateFrom || dateTo) && (
          <button
            type="button"
            className="search-clear"
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            title="Clear date filter"
          >
            <X />
          </button>
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
                    <img
                      src={avatars[avatarIdx % avatars.length]}
                      alt=""
                    />
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
                  <button
                    type="button"
                    onClick={() => toggleBlock(user[0])}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "28px",
                      padding: "0 18px",
                      border: 0,
                      borderRadius: "14px",
                      background: u.blocked ? "#17181a" : "#f2f3f4",
                      color: u.blocked ? "#fff" : "#333",
                      fontSize: "9px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background .15s ease, color .15s ease",
                    }}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            );
          })}
          {!visible.length && (
            <tr>
              <td colSpan={7}>
                <EmptyState
                  label={
                    tab === "blocked"
                      ? "No blocked users"
                      : "No users found"
                  }
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
