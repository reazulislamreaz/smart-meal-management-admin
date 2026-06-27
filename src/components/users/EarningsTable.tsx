import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getUserSubscription } from "@/utils/helpers";
import { users, avatars } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { Eye } from "lucide-react";

export function EarningsTable() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [subscription, setSubscription] = useState<"All" | "Annual" | "Monthly">("All");
  const pageSize = 4;

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => {
          if (!query) return true;
          return user.join(" ").toLowerCase().includes(query);
        })
        .filter((user) => {
          if (subscription === "All") return true;
          return getUserSubscription(user[0]) === subscription;
        })
        .sort((a, b) =>
          sortOrder === "asc"
            ? a[5].localeCompare(b[5])
            : b[5].localeCompare(a[5]),
        ),
    [query, sortOrder, subscription],
  );

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [query, subscription, sortOrder]);

  const cycleSubscription = () => {
    setSubscription((v) => (v === "All" ? "Annual" : v === "Annual" ? "Monthly" : "All"));
  };

  return (
    <section className="table-panel">
      <div className="table-toolbar">
        <h3>All Earning list</h3>
        <div className="filter-pills">
          <button
            type="button"
            className={sortOrder === "asc" ? "active" : ""}
            onClick={() => setSortOrder((v) => (v === "desc" ? "asc" : "desc"))}
          >
            Joining Date <ChevronDown />
          </button>
          <button
            type="button"
            className={subscription !== "All" ? "active" : ""}
            onClick={cycleSubscription}
          >
            {subscription === "All" ? "Subscription" : subscription} <ChevronDown />
          </button>
          <button
            type="button"
            className={sortOrder === "desc" ? "active" : ""}
            onClick={() => setSortOrder("desc")}
          >
            Recent Created <ChevronDown />
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {["Sl", "User Image", "Email", "Subscription Type", "Price", "Expire Date", "Action"].map(
              (h) => <th key={h}>{h}</th>,
            )}
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user, i) => (
            <tr key={user[0]}>
              <td>{user[0]}</td>
              <td>
                <div className="user-cell">
                  <img src={avatars[i % avatars.length]} alt="" />
                  <strong>{user[1].split(" ")[0]}</strong>
                </div>
              </td>
              <td>{user[2]}</td>
              <td>{getUserSubscription(user[0])}</td>
              <td>{`$${[10.99, 29.99, 49.99][i % 3]}`}</td>
              <td>
                {user[5].split("\n")[0]}
                <br />
                <small>02:20PM</small>
              </td>
              <td>
                <Link
                  aria-label={`View ${user[1]}`}
                  className="row-action"
                  to={`/earnings/${user[0]}`}
                >
                  <Eye />
                </Link>
              </td>
            </tr>
          ))}
          {!visibleUsers.length && (
            <tr>
              <td colSpan={7}>
                <EmptyState />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        page={page}
        pageCount={pageCount}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </section>
  );
}
export default EarningsTable;
