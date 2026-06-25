import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getUserSubscription } from "@/utils/helpers";
import { users, avatars } from "@/data/adminData";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";

export function UserTable({ earnings = false }: { earnings?: boolean }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [nameOnly, setNameOnly] = useState(false);
  const [subscription, setSubscription] = useState<
    "All" | "Annual" | "Monthly"
  >("All");
  const pageSize = 4;

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => {
          if (!query) return true;
          const target = nameOnly
            ? user[1].toLowerCase()
            : user.join(" ").toLowerCase();
          return target.includes(query);
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
    [nameOnly, query, sortOrder, subscription],
  );

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => setPage(1), [query, subscription, nameOnly, sortOrder]);

  const cycleSubscription = () => {
    setSubscription((value) =>
      value === "All" ? "Annual" : value === "Annual" ? "Monthly" : "All",
    );
  };

  return (
    <section className="table-panel">
      <div className="table-toolbar">
        <h3>{earnings ? "All Earning list" : "All Users list"}</h3>
        <div className="filter-pills">
          <button
            type="button"
            className={nameOnly ? "active" : ""}
            onClick={() => setNameOnly((value) => !value)}
          >
            {earnings ? "User Name" : "Search Name"} <Search />
          </button>
          <button
            type="button"
            className={sortOrder === "asc" ? "active" : ""}
            onClick={() =>
              setSortOrder((value) => (value === "desc" ? "asc" : "desc"))
            }
          >
            Joining Date <ChevronDown />
          </button>
          <button
            type="button"
            className={subscription !== "All" ? "active" : ""}
            onClick={cycleSubscription}
          >
            {subscription === "All" ? "Subscription" : subscription}{" "}
            <ChevronDown />
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
            {(earnings
              ? [
                  "Sl",
                  "User Image",
                  "Email",
                  "Subscription Type",
                  "Price",
                  "Expire Date",
                  "Action",
                ]
              : [
                  "Sl",
                  "User Name",
                  "Email",
                  "Phone Number",
                  "Address",
                  "Joining Date",
                  "Action",
                ]
            ).map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user, i) => (
            <tr key={user[0]}>
              <td>{user[0]}</td>
              <td>
                <div className="user-cell">
                  <img src={avatars[i]} alt="" />
                  <strong>{earnings ? user[1].split(" ")[0] : user[1]}</strong>
                </div>
              </td>
              <td>{user[2]}</td>
              <td>{earnings ? getUserSubscription(user[0]) : user[3]}</td>
              <td>{earnings ? `$${[10.99, 29.99, 49.99][i % 3]}` : user[4]}</td>
              <td>
                {user[5]}
                <br />
                <small>02:20PM</small>
              </td>
              <td>
                <Link
                  aria-label={`View ${user[1]}`}
                  className="row-action"
                  to={earnings ? `/earnings/${user[0]}` : `/users/${user[0]}`}
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
export default UserTable;
