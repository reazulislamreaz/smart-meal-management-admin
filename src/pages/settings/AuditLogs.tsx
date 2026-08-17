import { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Trash2,
  Search,
  RotateCcw,
  Clock,
  Eye,
  X,
  Code,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { adminApi, type AdminAuditLogItem } from "@/lib/adminApi";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import { TableSkeletonRows } from "@/components/common/Skeleton";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export function AuditLogs() {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  // Selected log for detail inspection modal
  const [selectedLog, setSelectedLog] = useState<AdminAuditLogItem | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  // Modal confirm cleanup state
  const [cleanupModal, setCleanupModal] = useState<{
    isOpen: boolean;
    type: "prune30" | "clearAll";
    isLoading: boolean;
  }>({
    isOpen: false,
    type: "prune30",
    isLoading: false,
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        action: actionFilter !== "ALL" ? actionFilter : undefined,
      });
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const total = res?.meta?.total ?? list.length;
      setLogs(list);
      setTotalItems(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, debouncedSearch, actionFilter]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, debouncedSearch, actionFilter]);

  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleExecuteCleanup = async () => {
    setCleanupModal((prev) => ({ ...prev, isLoading: true }));
    try {
      if (cleanupModal.type === "prune30") {
        const res = await adminApi.cleanupAuditLogs(30);
        toast.success(res.message || "Pruned logs older than 30 days. Kept last 30 days.");
      } else {
        const res = await adminApi.clearAllAuditLogs();
        toast.success(res.message || "All historical audit logs cleared.");
      }
      setCleanupModal({ isOpen: false, type: "prune30", isLoading: false });
      fetchLogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to clean up audit logs.");
      setCleanupModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getActionBadgeClass = (action: string) => {
    if (action.includes("CREATE") || action.includes("LOGIN") || action.includes("REGISTER") || action.includes("SYNCED")) {
      return "bg-[#dcfce7] text-[#15803d]";
    }
    if (action.includes("UPDATE") || action.includes("EDIT") || action.includes("TOGGLE") || action.includes("CONFIG")) {
      return "bg-[#dbeafe] text-[#1d4ed8]";
    }
    if (action.includes("DELETE") || action.includes("BLOCK") || action.includes("REVOKE") || action.includes("PRUNED") || action.includes("CLEARED")) {
      return "bg-[#fee2e2] text-[#b91c1c]";
    }
    return "bg-[#f3f4f6] text-[#4b5563]";
  };

  return (
    <SettingsLayout>
      <section className="bg-white border border-[#e5e7ea] rounded-[7px] overflow-hidden shadow-xs">
        {/* Header Title & Summary */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#eceef0] max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#17181a]" />
            <h3 className="m-0 text-[13px] font-bold text-[#17181a]">
              Administrative Security Audit Trail
            </h3>
            <span className="rounded-full bg-[#e2e4e8] text-[#555] text-[10px] font-bold px-2 py-[2px]">
              {totalItems} entries
            </span>
          </div>

          {/* Retention & Cleanup Action Buttons */}
          <div className="flex items-center gap-2 max-[620px]:flex-wrap">
            <button
              type="button"
              onClick={() => setCleanupModal({ isOpen: true, type: "prune30", isLoading: false })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-[4px] bg-[#f0f2f5] hover:bg-[#e4e7eb] text-[#17181a] border border-[#d8dadd] transition-colors cursor-pointer"
              title="Delete all data older than 30 days, retaining only the last 30 days"
            >
              <Clock size={12} className="text-[#059669]" />
              Keep Last 30 Days
            </button>

            <button
              type="button"
              onClick={() => setCleanupModal({ isOpen: true, type: "clearAll", isLoading: false })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-[4px] bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3] transition-colors cursor-pointer"
              title="Purge all audit logs from database"
            >
              <Trash2 size={12} />
              Clear All Logs
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-3 bg-[#ffffff] border-b border-[#eceef0] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-[360px]">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8a8d92]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search action, operator, entity or IP..."
                className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[#f8f9fa] border border-[#d8dadd] rounded-[4px] focus:outline-none focus:border-[#17181a] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-[32px] px-2.5 text-[11px] font-medium bg-white border border-[#d8dadd] rounded-[4px] text-[#34363a] cursor-pointer focus:outline-none focus:border-[#17181a]"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">Auth & Logins</option>
              <option value="REGISTER">User Signups</option>
              <option value="USER">User Management</option>
              <option value="MEAL">Recipe Catalog</option>
              <option value="PLAN">Subscriptions & Plans</option>
              <option value="COUPON">Coupons & Promo</option>
              <option value="TASK">Tasks & Chores</option>
              <option value="CONFIG">System Settings</option>
              <option value="PRUNED">Retention & Pruning</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-[32px] px-2.5 text-[11px] font-medium bg-white border border-[#d8dadd] rounded-[4px] text-[#34363a] cursor-pointer focus:outline-none focus:border-[#17181a]"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActionFilter("ALL");
                fetchLogs();
              }}
              className="p-2 text-[#555] hover:text-[#17181a] hover:bg-[#f0f2f5] rounded-[4px] transition-colors cursor-pointer"
              title="Refresh logs"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity Target</th>
                <th>Operator</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows cols={6} rows={pageSize} />
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold font-mono rounded-[3px] ${getActionBadgeClass(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span className="text-[12px] font-semibold text-[#111827]">
                        {log.entity}
                        {log.entityId && (
                          <small className="ml-1 text-[#8a8d92] font-mono text-[10px]">
                            ({log.entityId.slice(0, 8)}...)
                          </small>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <User size={11} className="text-[#8a8d92]" />
                        <span>{log.user?.name || log.user?.email || "System Operator"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-[11px] text-[#6b7280]">
                        {log.ipAddress || "127.0.0.1"}
                      </span>
                    </td>
                    <td>
                      <small className="text-[#71757b]">
                        {new Date(log.createdAt).toLocaleString()}
                      </small>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#2563eb] hover:bg-[#eff6ff] rounded-[3px] transition-colors cursor-pointer"
                        title="View complete event payload"
                      >
                        <Eye size={12} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState label={search ? "No audit logs match your search" : "No security audit events recorded yet."} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination */}
        <Pagination
          page={page}
          pageCount={pageCount}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </section>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[8px] max-w-[560px] w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#dfe1e5]">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#f8f9fa] border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[#2563eb]" />
                <h3 className="m-0 text-[14px] font-bold text-[#17181a]">
                  Audit Event Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 text-[#6b7280] hover:text-[#17181a] hover:bg-[#e5e7ea] rounded-[4px] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-4 text-[12px]">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] border border-[#e5e7ea] rounded-[6px]">
                <div>
                  <span className="text-[#6b7280] text-[11px] block mb-1">Action Event</span>
                  <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold font-mono rounded-[3px] ${getActionBadgeClass(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <span className="text-[#6b7280] text-[11px] block mb-1">Target Entity</span>
                  <strong className="text-[13px] text-[#111827]">{selectedLog.entity}</strong>
                  {selectedLog.entityId && (
                    <small className="font-mono text-[#8a8d92] block text-[10px] truncate">
                      {selectedLog.entityId}
                    </small>
                  )}
                </div>
                <div>
                  <span className="text-[#6b7280] text-[11px] block mb-1">Operator Account</span>
                  <strong className="text-[#111827]">
                    {selectedLog.user?.name || selectedLog.user?.email || "System"}
                  </strong>
                  {selectedLog.user?.email && (
                    <span className="text-[#6b7280] block text-[10px]">
                      {selectedLog.user.email}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[#6b7280] text-[11px] block mb-1">IP Address & Time</span>
                  <span className="font-mono text-[#111827] block text-[11px]">
                    {selectedLog.ipAddress || "127.0.0.1"}
                  </span>
                  <small className="text-[#6b7280] block text-[10px]">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5 text-[#374151] font-semibold text-[12px]">
                  <Code size={13} /> Event Metadata & Attributes
                </div>
                <pre className="p-3 bg-[#17181a] text-[#a7f3d0] rounded-[6px] font-mono text-[11px] overflow-x-auto border border-[#2e3035]">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eceef0] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-[12px] font-medium bg-[#17181a] text-white hover:bg-[#2e3035] rounded-[4px] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Retention Cleanup */}
      <ConfirmModal
        isOpen={cleanupModal.isOpen}
        title={
          cleanupModal.type === "prune30"
            ? "Prune Historical Logs (Keep Last 30 Days)"
            : "Clear All Audit Logs"
        }
        message={
          cleanupModal.type === "prune30"
            ? "Are you sure you want to delete all audit records older than 30 days? Only the last 30 days of security logs will be retained in the database."
            : "Are you sure you want to completely clear all security audit trail logs? This action is permanent and cannot be undone."
        }
        confirmText={
          cleanupModal.type === "prune30"
            ? "Yes, Delete Older than 30 Days"
            : "Yes, Clear All Logs"
        }
        cancelText="Cancel"
        variant="danger"
        isLoading={cleanupModal.isLoading}
        onConfirm={handleExecuteCleanup}
        onCancel={() => setCleanupModal({ isOpen: false, type: "prune30", isLoading: false })}
      />
    </SettingsLayout>
  );
}

export default AuditLogs;
