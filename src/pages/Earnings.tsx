import PageHeading from "@/components/common/PageHeading";
import BarChart from "@/components/common/BarChart";
import EarningsTable from "@/components/users/EarningsTable";

export function Earnings() {
  return (
    <>
      <PageHeading title="Earnings Overview" />
      <p className="m-0 mb-[18px] text-[#71757b] text-[16px]">
        Track your revenue, profits, and financial metrics
      </p>
      <BarChart title="Revenue Breakdown" />
      <EarningsTable />
    </>
  );
}
export default Earnings;
