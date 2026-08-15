import { useState, useEffect } from "react";
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
import { adminApi, type DashboardStatsResponse } from "@/lib/adminApi";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminApi
      .getDashboardStats()
      .then((data) => {
        if (isMounted && data) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load remote dashboard stats, using defaults:", err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsers = stats?.miniStats?.totalUsers?.value || "2,543";
  const activeTotal = stats?.miniStats?.activeTotal?.value || "1.3k";
  const meed = stats?.miniStats?.meed?.value || "$10,500";
  const mealPayment = stats?.miniStats?.mealPayment?.value || "32.8k";

  return (
    <>
      <div className="grid grid-cols-2 gap-4 min-[1600px]:gap-5 max-[1100px]:grid-cols-1">
        <div className="grid grid-cols-2 gap-[14px] min-[1600px]:gap-4 max-[620px]:grid-cols-1">
          <MiniStat icon={<UsersRound />} value={totalUsers} label="Total Users" />
          <MiniStat icon={<FileText />} value={activeTotal} label="Active Total" />
          <MiniStat
            icon={<CircleDollarSign />}
            value={meed}
            label="MEED"
          />
          <MiniStat icon={<CreditCard />} value={mealPayment} label="Meal/Payment" />
        </div>
        <IncomeRing
          percentage={stats?.incomeRing?.percentage}
          yearlyEarnings={stats?.incomeRing?.yearlyEarnings}
          description={stats?.incomeRing?.description}
          today={stats?.incomeRing?.today}
          weekly={stats?.incomeRing?.weekly}
          monthly={stats?.incomeRing?.monthly}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 min-[1600px]:gap-5 max-[620px]:grid-cols-1">
        <DashboardList users={stats?.recentUsers} />
        <TopMeals meals={stats?.topMeals} />
      </div>
    </>
  );
}
export default Dashboard;
