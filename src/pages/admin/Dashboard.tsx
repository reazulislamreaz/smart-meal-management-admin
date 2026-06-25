import {
  UsersRound,
  FileText,
  CircleDollarSign,
  CreditCard,
} from "lucide-react";
import MiniStat from "@/components/dashboard/MiniStat";
import IncomeRing from "@/components/dashboard/IncomeRing";
import DashboardList from "@/components/dashboard/DashboardList";
import TopMeals from "@/components/dashboard/TopMeals";

export function Dashboard() {
  return (
    <>
      <div className="dashboard-grid">
        <div className="stats-grid">
          <MiniStat icon={<UsersRound />} value="2,543" label="Total Users" />
          <MiniStat icon={<FileText />} value="1.3k" label="Active Total" />
          <MiniStat
            icon={<CircleDollarSign />}
            value="$10,500"
            label="MEED"
            money
          />
          <MiniStat icon={<CreditCard />} value="32.8k" label="Meal/Payment" />
        </div>
        <IncomeRing />
      </div>
      <div className="dashboard-lower">
        <DashboardList />
        <TopMeals />
      </div>
    </>
  );
}
export default Dashboard;
