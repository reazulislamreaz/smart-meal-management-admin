import { useState, useEffect, useMemo } from "react";
import { Plus, Tag, Search, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import PageHeading from "@/components/common/PageHeading";
import { adminApi, type AdminCouponItem } from "@/lib/adminApi";
import CouponFormModal from "@/components/coupons/CouponFormModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import EmptyState from "@/components/common/EmptyState";
import { TableSkeletonRows } from "@/components/common/Skeleton";

export function Coupons() {
  const [coupons, setCoupons] = useState<AdminCouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCouponItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    coupon: AdminCouponItem | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    coupon: null,
    isLoading: false,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCoupons({
        search: search || undefined,
        isActive: statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE",
      });
      setCoupons(Array.isArray(res) ? res : []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load promotional coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCoupons();
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  const handleCreateNew = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: AdminCouponItem) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (data: {
    code: string;
    discountPercent: number;
    validUntil?: string | null;
    maxRedemptions?: number;
    isActive?: boolean;
  }) => {
    setModalLoading(true);
    try {
      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.id, data);
        toast.success(`Coupon "${data.code}" updated successfully.`);
      } else {
        await adminApi.createCoupon(data);
        toast.success(`Coupon "${data.code}" created successfully.`);
      }
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "Failed to save coupon.");
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (coupon: AdminCouponItem) => {
    try {
      const updated = await adminApi.toggleCouponStatus(coupon.id);
      toast.success(
        `Coupon "${coupon.code}" is now ${updated.isActive ? "ACTIVE" : "INACTIVE"}.`,
      );
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: updated.isActive } : c)),
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle coupon status.");
    }
  };

  const requestDelete = (coupon: AdminCouponItem) => {
    setDeleteConfirm({
      isOpen: true,
      coupon,
      isLoading: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.coupon) return;
    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminApi.deleteCoupon(deleteConfirm.coupon.id);
      toast.success(`Coupon "${deleteConfirm.coupon.code}" deleted.`);
      setCoupons((prev) => prev.filter((c) => c.id !== deleteConfirm.coupon!.id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete coupon.");
    } finally {
      setDeleteConfirm({ isOpen: false, coupon: null, isLoading: false });
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      if (statusFilter === "ACTIVE") return c.isActive;
      if (statusFilter === "INACTIVE") return !c.isActive;
      return true;
    });
  }, [coupons, statusFilter]);

  return (
    <>
      <PageHeading
        title="Promotional Coupons"
        action={
          <button
            type="button"
            onClick={handleCreateNew}
            className="dark-button inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={13} />
            <span>Create Coupon</span>
          </button>
        }
      />
      <p className="m-0 mb-[18px] text-[#71757b] text-[15px]">
        Create, activate, and manage promotional discount codes for platform subscriptions.
      </p>

      {/* Toolbar */}
      <div className="bg-white border border-[#e5e7ea] rounded-[7px] max-w-full overflow-hidden shadow-xs">
        <div className="flex items-center justify-between gap-3 flex-wrap px-4 py-2.5 bg-[#f0f1f3] border-b border-[#dfe1e5]">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#17181a]" />
            <h3 className="m-0 text-[13px] font-bold text-[#17181a]">
              Active Coupons ({filteredCoupons.length})
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
                placeholder="Search coupon code..."
                className="w-[180px] h-[30px] pl-8 pr-3 text-[11px] bg-white border border-[#d1d4d9] rounded-[15px] focus:border-[#17181a] outline-none"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex rounded-[15px] border border-[#d1d4d9] bg-white p-[2px]">
              {(["ALL", "ACTIVE", "INACTIVE"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-[13px] transition-colors cursor-pointer ${statusFilter === tab ? "bg-[#17181a] text-white" : "text-[#52565b] hover:text-[#17181a]"}`}
                >
                  {tab === "ALL" ? "All" : tab === "ACTIVE" ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Redemptions</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows cols={7} rows={4} />
              ) : filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => {
                  const redemptionCount = coupon.redemptionCount || 0;
                  const percentUsed = Math.min(
                    100,
                    Math.round((redemptionCount / coupon.maxRedemptions) * 100),
                  );
                  const isExpired =
                    coupon.validUntil && new Date(coupon.validUntil) < new Date();

                  return (
                    <tr key={coupon.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-[#f3f4f6] border border-[#e5e7eb] px-2 py-0.5 rounded-[4px] text-[12px] text-[#111827] tracking-wide">
                            {coupon.code}
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong className="text-[12px] text-[#059669] font-bold flex items-center gap-0.5">
                          {coupon.discountPercent}% OFF
                        </strong>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 w-[120px]">
                          <div className="flex justify-between text-[10px] text-[#71757b]">
                            <span>
                              {redemptionCount} / {coupon.maxRedemptions}
                            </span>
                            <span>{percentUsed}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#10b981] rounded-full"
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        {coupon.validUntil ? (
                          <span
                            className={
                              isExpired ? "text-[#e5484d] font-semibold" : "text-[#4b5563]"
                            }
                          >
                            {new Date(coupon.validUntil).toLocaleDateString()}
                            {isExpired && " (Expired)"}
                          </span>
                        ) : (
                          <span className="text-[#9ca3af]">No Expiry</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(coupon)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-[4px] cursor-pointer transition-colors ${coupon.isActive ? "bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0]" : "bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fecaca]"}`}
                        >
                          {coupon.isActive ? (
                            <>
                              <CheckCircle2 size={11} /> ACTIVE
                            </>
                          ) : (
                            <>
                              <XCircle size={11} /> INACTIVE
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <small className="text-[#71757b]">
                          {new Date(coupon.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(coupon)}
                            className="p-1 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-[4px] transition-colors cursor-pointer"
                            title="Edit Coupon"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(coupon)}
                            className="p-1 text-[#6b7280] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-[4px] transition-colors cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      label={
                        search
                          ? `No coupons match "${search}"`
                          : "No promotional coupons found."
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation & Edit Modal */}
      <CouponFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCoupon}
        coupon={editingCoupon}
        isLoading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Promotional Coupon"
        message={`Are you sure you want to permanently delete coupon code "${deleteConfirm.coupon?.code}"? Users will no longer be able to apply this coupon.`}
        itemName={deleteConfirm.coupon?.code}
        confirmText="Yes, Delete Coupon"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteConfirm.isLoading}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, coupon: null, isLoading: false })
        }
      />
    </>
  );
}

export default Coupons;
