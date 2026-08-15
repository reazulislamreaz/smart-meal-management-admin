import { useState, useEffect, useMemo } from "react";
import { Search, Eye, Trash2, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import PageHeading from "@/components/common/PageHeading";
import { adminApi, type AdminContactMessage } from "@/lib/adminApi";
import MessageDetailModal from "@/components/messages/MessageDetailModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { TableSkeletonRows } from "@/components/common/Skeleton";

export function Messages() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ" | "RESOLVED">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 8;

  // Selected message for detail view modal
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessage | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    senderName: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    id: "",
    senderName: "",
    isLoading: false,
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.listContactMessages({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page,
        limit: pageSize,
      });

      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const total = res?.meta?.total ?? list.length;
      setMessages(list);
      setTotalItems(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load support inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, page]);

  const handleUpdateStatus = async (id: string, newStatus: "UNREAD" | "READ" | "RESOLVED") => {
    setModalLoading(true);
    try {
      await adminApi.updateContactStatus(id, newStatus);
      toast.success(`Message marked as ${newStatus}.`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update inquiry status.");
    } finally {
      setModalLoading(false);
    }
  };

  const requestDelete = (message: AdminContactMessage) => {
    setDeleteConfirm({
      isOpen: true,
      id: message.id,
      senderName: message.name,
      isLoading: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminApi.deleteContactMessage(deleteConfirm.id);
      toast.success("Support inquiry deleted.");
      setMessages((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
      if (selectedMessage?.id === deleteConfirm.id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete message.");
    } finally {
      setDeleteConfirm({ isOpen: false, id: "", senderName: "", isLoading: false });
    }
  };

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        m.message.toLowerCase().includes(q),
    );
  }, [messages, search]);

  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <>
      <PageHeading title="Support & Contact Messages" />
      <p className="m-0 mb-[18px] text-[#71757b] text-[15px]">
        Review inquiries, feedback, and customer assistance messages submitted through the platform.
      </p>

      {/* Toolbar */}
      <div className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full overflow-hidden shadow-xs">
        <div className="flex items-center justify-between gap-3 flex-wrap px-4 py-2.5 bg-[#f0f1f3] border-b border-[#dfe1e5]">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-[#17181a]" />
            <h3 className="m-0 text-[13px] font-bold text-[#17181a]">
              Messages Inbox ({totalItems})
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#8a8d92]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sender, email, subject..."
                className="w-[200px] h-[30px] pl-8 pr-3 text-[11px] bg-white border border-[#d1d4d9] rounded-[15px] focus:border-[#17181a] outline-none"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex rounded-[15px] border border-[#d1d4d9] bg-white p-[2px]">
              {(["ALL", "UNREAD", "READ", "RESOLVED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab);
                    setPage(1);
                  }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-[13px] transition-colors cursor-pointer ${statusFilter === tab ? "bg-[#17181a] text-white" : "text-[#52565b] hover:text-[#17181a]"}`}
                >
                  {tab === "ALL"
                    ? "All"
                    : tab === "UNREAD"
                      ? "Unread"
                      : tab === "READ"
                        ? "Read"
                        : "Resolved"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message Preview</th>
                <th>Received</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows cols={7} rows={5} />
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={msg.status === "UNREAD" ? "bg-[#faf5ff] font-semibold" : ""}
                  >
                    <td>
                      <strong className="text-[12px] text-[#111827]">{msg.name}</strong>
                    </td>
                    <td>
                      <span className="text-[#4b5563] text-[12px]">{msg.email}</span>
                    </td>
                    <td>
                      <span className="text-[#111827] text-[12px] max-w-[160px] truncate block">
                        {msg.subject || "General Inquiry"}
                      </span>
                    </td>
                    <td>
                      <span className="text-[#6b7280] text-[11px] max-w-[240px] truncate block">
                        {msg.message}
                      </span>
                    </td>
                    <td>
                      <small className="text-[#71757b]">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-[4px] ${msg.status === "RESOLVED" ? "bg-[#dcfce7] text-[#15803d]" : msg.status === "READ" ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#fee2e2] text-[#b91c1c]"}`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedMessage(msg)}
                          className="inline-flex items-center gap-1 h-[26px] px-2 rounded-[13px] border border-[#d0d3d8] bg-white text-[#34363a] text-[10px] font-semibold hover:bg-[#17181a] hover:text-white transition-colors cursor-pointer"
                          title="View Message"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(msg)}
                          className="p-1 text-[#6b7280] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-[4px] transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      label={
                        search
                          ? `No inquiries match "${search}"`
                          : "No support inquiries in this folder."
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > pageSize && (
          <Pagination
            page={page}
            pageCount={pageCount}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Message View Modal */}
      <MessageDetailModal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        message={selectedMessage}
        onUpdateStatus={handleUpdateStatus}
        onDelete={async (id) => {
          setSelectedMessage(null);
          requestDelete(messages.find((m) => m.id === id)!);
        }}
        isLoading={modalLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Support Inquiry"
        message={`Are you sure you want to delete the support message from "${deleteConfirm.senderName}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, id: "", senderName: "", isLoading: false })
        }
      />
    </>
  );
}

export default Messages;
