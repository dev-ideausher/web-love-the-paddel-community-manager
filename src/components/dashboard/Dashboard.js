import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Loader from "../ui/Loader";
import PromoCard from "./PromoCard";
import TableNoHeader from "../ui/TableNoHeader";
import Image from "next/image";
import RecentActivity from "../ui/RecentActivity";
import QuickAccess from "../ui/QuickAccess";
import { getCommunityDashboard } from "@/services/api/transactions";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await getCommunityDashboard();
        if (response.status && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Loader loading={loading} />
      <div className="flex flex-col justify-between gap-[16px] mt-8 mb-6">
        <h1 className="text-2xl font-semibold">Welcome, Community Manager</h1>
        <p className="text-base">
          Manage your communities, matches, and announcements
        </p>
      </div>
      <PromoCard summary={dashboardData?.summary} />
      <div className="flex flex-row gap-6">
        <div className="w-5/6">
          <TableNoHeader
            data={dashboardData?.upcomingMatches}
            onViewAll={() => router.push("/matches")}
          />
        </div>

        <RecentActivity activities={dashboardData?.recentActivity} />
      </div>

      <QuickAccess stats={dashboardData?.quickAccess} />
    </>
  );
};

export default Dashboard;
