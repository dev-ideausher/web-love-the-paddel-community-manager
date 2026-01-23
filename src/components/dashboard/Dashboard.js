import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Loader from "../ui/Loader";
import PromoCard from "./PromoCard";
import TableNoHeader from "../ui/TableNoHeader";
import Image from "next/image";
import RecentActivity from "../ui/RecentActivity";
import QuickAccess from "../ui/QuickAccess";

// RecentActivity Component
const accessStats = {
  communities: 12,
  matches: 5,
  updates: 3,
  payments: 44,
};
const sampleMatches = [
  {
    id: "1",
    name: "Weeknend Paddlers tournament",
    location: "Downtown Paddlers club",
    dateTime: "12th June 2024, 5:00 PM",
    playersCurrent: 8,
    playersMax: 16,
    type: "Friendly",
  },
];

const sampleActivity = [
  {
    id: "1",
    description: 'New community "Downtown Paddlers" created.',
    timestamp: "2025-01-01T12:00:00Z",
    type: "money",
  },
  {
    id: "2",
    description: "Match scheduled.",
    timestamp: "2025-01-14T08:44:00Z",
    type: "calendar",
  },
  {
    id: "3",
    description: "User joined community.",
    timestamp: "2025-01-14T10:30:00Z",
    type: "community",
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <Loader loading={loading} />
      <div className="flex flex-col justify-between gap-[16px] mt-8 mb-6">
        <h1 className="text-2xl font-semibold">Welcome, Community Manager</h1>
        <p className="text-base">
          Manage your communities, matches, and announcements
        </p>
      </div>
      <PromoCard />
      <div className="flex flex-row gap-6">
        <div className="w-5/6">
          <TableNoHeader
            data={sampleMatches}
            onViewAll={() => router.push("/matches")}
          />
        </div>

        <RecentActivity activities={sampleActivity} />
      </div>

      <QuickAccess stats={accessStats} />
    </>
  );
};

export default Dashboard;
