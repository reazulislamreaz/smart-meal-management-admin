import PageHeading from "@/components/common/PageHeading";
import BarChart from "@/components/common/BarChart";
import UserTable from "@/components/users/UserTable";

export function Earnings() {
  return (
    <>
      <PageHeading title="Earnings Overview" />
      <p className="subtitle">
        Track your revenue, profits, and financial metrics
      </p>
      <BarChart title="Revenue Breakdown" />
      <UserTable earnings />
    </>
  );
}
export default Earnings;
