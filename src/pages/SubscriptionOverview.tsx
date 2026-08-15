import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import BarChart from "@/components/common/BarChart";
import { adminApi } from "@/lib/adminApi";

export function SubscriptionOverview() {
  const [overview, setOverview] = useState<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    annualSubscribers: number;
    monthlySubscribers: number;
    monthlyRevenue: string;
    retentionRate: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminApi
      .getSubscriptionOverview()
      .then((data) => {
        if (isMounted && data) {
          setOverview(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load subscription overview from backend:", err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSubs = overview?.totalSubscriptions ?? 1309;
  const annualSubs = overview?.annualSubscribers ?? 1309;
  const monthlyRev = overview?.monthlyRevenue ?? "$20";

  return (
    <>
      <PageHeading
        title="Subscription"
        action={
          <Link to="/subscription/plans" className="dark-button">
            Subscription plan
          </Link>
        }
      />
      <p className="m-0 mb-[18px] text-[#71757b] text-[16px]">
        Manage your subscription plan.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-5 max-[620px]:grid-cols-1 max-[420px]:gap-3">
        <div className="relative min-h-[115px] bg-white border border-[#e5e7ea] rounded-[6px] p-[15px] flex flex-col gap-[7px] overflow-hidden">
          <span className="text-[#d49a28] text-[12px] font-semibold">TOTAL</span>
          <strong className="text-[23px]">{totalSubs}</strong>
          <small className="text-[#777]">Subscribers</small>
          <i className="absolute bottom-0 left-0 h-1 w-full bg-[#48c773]" />
        </div>
        <div className="relative min-h-[115px] bg-white border border-[#e5e7ea] rounded-[6px] p-[15px] flex flex-col gap-[7px] overflow-hidden">
          <span className="text-[#d49a28] text-[12px] font-semibold">ANNUAL</span>
          <strong className="text-[23px]">{annualSubs}</strong>
          <small className="text-[#777]">Subscribers</small>
          <i className="absolute bottom-0 left-0 h-1 w-full bg-[#488ee5]" />
        </div>
        <div className="relative min-h-[115px] bg-white border border-[#e5e7ea] rounded-[6px] p-[15px] flex flex-col gap-[7px] overflow-hidden">
          <span className="text-[#d49a28] text-[12px] font-semibold">
            SUBSCRIPTION
          </span>
          <strong className="text-[23px]">{monthlyRev}</strong>
          <small className="text-[#777]">Monthly revenue</small>
          <i className="absolute bottom-0 left-0 h-1 w-full bg-[#e2ae45]" />
        </div>
      </div>
      <BarChart title="Revenue Breakdown" />
    </>
  );
}
export default SubscriptionOverview;
