import { useState, useEffect } from "react";
import { ShieldCheck, User } from "lucide-react";
import toast from "react-hot-toast";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { adminApi, type AdminAuditLogItem } from "@/lib/adminApi";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import { TableSkeletonRows } from "@/components/common/Skeleton";

export function AuditLogs() {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs({ page, limit: pageSize });
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
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  const getActionBadgeClass = (action: string) => {
    if (action.includes("CREATE") || action.includes("LOGIN") || action.includes("REGISTER")) {
      return "bg-[#dcfce7] text-[#15803d]";
    }
    if (action.includes("UPDATE") || action.includes("EDIT") || action.includes("TOGGLE")) {
      return "bg-[#dbeafe] text-[#1d4ed8]";
    }
    if (action.includes("DELETE") || action.includes("BLOCK") || action.includes("REVOKE")) {
      return "bg-[#fee2e2] text-[#b91c1c]";
    }
    return "bg-[#f3f4f6] text-[#4b5563]";
  };

  return (
    <SettingsLayout>
      <section className="bg-white border border-[#e5e7ea] rounded-[7px] overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#17181a]" />
            <h3 className="m-0 text-[13px] font-bold text-[#17181a]">
              Administrative Security Audit Trail ({totalItems})
            </h3>
          </div>
          <span className="text-[11px] text-[#71757b]">
            Logs system mutations, user status alterations, and billing events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity Target</th>
                <th>Operator</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows cols={5} rows={6} />
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
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
                        <span>{log.user?.name || log.user?.email || "System"}</span>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState label="No security audit events recorded yet." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > pageSize && (
          <div className="p-3 border-t border-[#f0f1f3]">
            <Pagination
              page={page}
              pageCount={pageCount}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </SettingsLayout>
  );
}

export default AuditLogs;
