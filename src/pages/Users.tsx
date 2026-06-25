import PageHeading from "@/components/common/PageHeading";
import BarChart from "@/components/common/BarChart";
import UserTable from "@/components/users/UserTable";

export function Users() {
  return (
    <>
      <PageHeading title="Manage User" />
      <BarChart />
      <UserTable />
    </>
  );
}
export default Users;
