import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import BarChart from "@/components/common/BarChart";

export function SubscriptionOverview() {
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
          <strong className="text-[23px]">1309</strong>
          <small className="text-[#777]">Subscribers</small>
          <i className="absolute bottom-0 left-0 h-1 w-full bg-[#48c773]" />
        </div>
        <div className="relative min-h-[115px] bg-white border border-[#e5e7ea] rounded-[6px] p-[15px] flex flex-col gap-[7px] overflow-hidden">
          <span className="text-[#d49a28] text-[12px] font-semibold">ANNUAL</span>
          <strong className="text-[23px]">1309</strong>
          <small className="text-[#777]">Subscribers</small>
          <i className="absolute bottom-0 left-0 h-1 w-full bg-[#488ee5]" />
        </div>
        <div className="relative min-h-[115px] bg-white border border-[#e5e7ea] rounded-[6px] p-[15px] flex flex-col gap-[7px] overflow-hidden">
          <span className="text-[#d49a28] text-[12px] font-semibold">
            SUBSCRIPTION
          </span>
          <strong className="text-[23px]">$20</strong>
          <small className="text-[#777]">Monthly revenue</small>
          <i className="absolute bottom-0 left-0 h-1 w-full bg-[#e2ae45]" />
        </div>
      </div>
      <BarChart title="Revenue Breakdown" />
    </>
  );
}
export default SubscriptionOverview;
