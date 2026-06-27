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
      <div className="grid grid-cols-2 gap-4 min-[1600px]:gap-5 max-[1100px]:grid-cols-1">
        <div className="grid grid-cols-2 gap-[14px] min-[1600px]:gap-4 max-[620px]:grid-cols-1">
          <MiniStat icon={<UsersRound />} value="2,543" label="Total Users" />
          <MiniStat icon={<FileText />} value="1.3k" label="Active Total" />
          <MiniStat
            icon={<CircleDollarSign />}
            value="$10,500"
            label="MEED"
          />
          <MiniStat icon={<CreditCard />} value="32.8k" label="Meal/Payment" />
        </div>
        <IncomeRing />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 min-[1600px]:gap-5 max-[620px]:grid-cols-1">
        <DashboardList />
        <TopMeals />
      </div>
    </>
  );
}
export default Dashboard;
