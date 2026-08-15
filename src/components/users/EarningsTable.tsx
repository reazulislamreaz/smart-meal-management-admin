import { useState, useEffect } from "react";
import { ChevronDown, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { adminApi, type EarningsSubscriberItem } from "@/lib/adminApi";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import UserAvatar from "@/components/common/UserAvatar";
import { TableSkeletonRows } from "@/components/common/Skeleton";

export function EarningsTable() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [subscription, setSubscription] = useState<"All" | "Annual" | "Monthly">("All");
  const pageSize = 5;

  const [subscribers, setSubscribers] = useState<EarningsSubscriberItem[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getEarningsSubscribers({
        page,
        limit: pageSize,
        search: debouncedQuery || undefined,
        subscriptionType: subscription !== "All" ? subscription : undefined,
        sortOrder,
      });

      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const total = res?.meta?.total ?? list.length;
      setSubscribers(list);
      setTotalSubscribers(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load subscriber transactions.");
      setSubscribers([]);
      setTotalSubscribers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [page, debouncedQuery, subscription, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, subscription, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(totalSubscribers / pageSize));

  const cycleSubscription = () => {
    setSubscription((v) =>
      v === "All" ? "Annual" : v === "Annual" ? "Monthly" : "All",
    );
  };

  const pillBase =
    "flex items-center gap-[7px] border-0 rounded-[14px] px-[10px] py-[6px] text-[12px] cursor-pointer transition-[background,box-shadow,color] duration-150 [&_svg]:w-[10px] [&_svg]:h-[10px]";
  const pillIdle = "bg-white hover:bg-[#f7f8fa] text-[#27292c]";
  const pillActive = "bg-[#17181a] text-white shadow-[0_1px_4px_rgba(23,24,26,.18)]";

  return (
    <section className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full mt-[15px] overflow-x-auto overflow-y-hidden shadow-xs">
      <div className="min-h-[45px] px-[13px] flex items-center justify-between bg-[#f0f1f3] max-[900px]:min-w-[760px] border-b border-[#dfe1e5]">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-[13px] font-bold text-[#17181a]">
            All Subscriber Transactions
          </h3>
          <span className="rounded-full bg-[#e2e4e8] text-[#555] text-[10px] font-bold px-2 py-[2px]">
            {totalSubscribers}
          </span>
        </div>

        <div className="flex gap-[7px] max-[620px]:flex-nowrap">
          <button
            type="button"
            className={`${pillBase} ${sortOrder === "asc" ? pillActive : pillIdle}`}
            onClick={() => setSortOrder((v) => (v === "desc" ? "asc" : "desc"))}
          >
            Sort: {sortOrder === "desc" ? "Newest" : "Oldest"} <ChevronDown />
          </button>
          <button
            type="button"
            className={`${pillBase} ${subscription !== "All" ? pillActive : pillIdle}`}
            onClick={cycleSubscription}
          >
            Tier: {subscription === "All" ? "All Plans" : subscription} <ChevronDown />
          </button>
          <button
            type="button"
            className={`${pillBase} ${pillIdle}`}
            onClick={() => {
              setSortOrder("desc");
              setSubscription("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {[
              "S/L",
              "User Name",
              "Email",
              "Subscription",
              "Price",
              "Expire Date",
              "Action",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeletonRows cols={7} rows={pageSize} />
          ) : subscribers.length > 0 ? (
            subscribers.map((item, i) => (
              <tr key={item.id}>
                <td style={{ color: "#777", fontSize: "10px" }}>{item.sl}</td>
                <td>
                  <div className="flex items-center gap-[7px]">
                    <UserAvatar
                      src={item.avatar}
                      name={item.userName}
                      fallbackIndex={i}
                      className="w-[22px] h-[22px] rounded-full object-cover"
                    />
                    <strong className="font-medium">{item.userName}</strong>
                  </div>
                </td>
                <td>{item.email}</td>
                <td>
                  <span className="font-medium text-[#111827]">
                    {item.subscriptionType}
                  </span>
                </td>
                <td>
                  <strong className="text-[#059669]">{item.price}</strong>
                </td>
                <td>
                  {item.expireDate}
                  {item.expireTime && (
                    <>
                      <br />
                      <small>{item.expireTime}</small>
                    </>
                  )}
                </td>
                <td>
                  <Link
                    to={`/earnings/${item.userId || item.id}`}
                    className="inline-flex items-center gap-1 h-[27px] px-[10px] rounded-[13px] border border-[#d0d3d8] bg-white text-[#34363a] text-[10px] font-semibold no-underline whitespace-nowrap cursor-pointer transition-[background,border-color,color,box-shadow] duration-140 hover:bg-[#17181a] hover:border-[#17181a] hover:text-white [&_svg]:w-[11px] [&_svg]:h-[11px]"
                  >
                    <Eye />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>
                <EmptyState label="No transactions found" />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalSubscribers > pageSize && (
        <Pagination
          page={page}
          pageCount={pageCount}
          totalItems={totalSubscribers}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}

export default EarningsTable;
