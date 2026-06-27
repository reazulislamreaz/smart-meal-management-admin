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

  const pillBase =
    "flex items-center gap-[7px] border-0 rounded-[14px] px-[10px] py-[6px] text-[12px] transition-[background,box-shadow,color] duration-150 [&_svg]:w-[10px] [&_svg]:h-[10px]";
  const pillIdle = "bg-white hover:bg-[#f7f8fa]";
  const pillActive = "bg-[#17181a] text-white shadow-[0_1px_4px_rgba(23,24,26,.18)]";

  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full mt-[15px] overflow-x-auto overflow-y-hidden">
      <div className="min-h-[45px] px-[13px] flex items-center justify-between bg-[#f0f1f3] max-[900px]:min-w-[760px]">
        <h3 className="m-0 text-[16px]">All Earning list</h3>
        <div className="flex gap-[7px] max-[620px]:flex-nowrap">
          <button
            type="button"
            className={`${pillBase} ${sortOrder === "asc" ? pillActive : pillIdle}`}
            onClick={() => setSortOrder((v) => (v === "desc" ? "asc" : "desc"))}
          >
            Joining Date <ChevronDown />
          </button>
          <button
            type="button"
            className={`${pillBase} ${subscription !== "All" ? pillActive : pillIdle}`}
            onClick={cycleSubscription}
          >
            {subscription === "All" ? "Subscription" : subscription} <ChevronDown />
          </button>
          <button
            type="button"
            className={`${pillBase} ${sortOrder === "desc" ? pillActive : pillIdle}`}
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
                <div className="flex items-center gap-[7px]">
                  <img
                    src={avatars[i % avatars.length]}
                    alt=""
                    className="w-[22px] h-[22px] rounded-full object-cover"
                  />
                  <strong className="font-medium">{user[1].split(" ")[0]}</strong>
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
                  className="grid place-items-center w-[22px] h-[22px] border border-[#d8dadd] rounded-full [&_svg]:w-[11px]"
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
