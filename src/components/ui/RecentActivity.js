import Image from "next/image";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      calendar: "/icons/notification1.svg",
      money: "/icons/notification2.svg",
      community: "/icons/notification3.svg",
      announcement: "/icons/notification4.svg",
    };
    return icons[type] || icons.community;
  };

  const TimeAgo = ({ timestamp }) => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const past = new Date(timestamp);
      const diffMs = now - past;

      const seconds = Math.floor(diffMs / 1000);
      if (seconds < 60) return "just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
      <span className="text-sm text-gray-400" suppressHydrationWarning>
        {calculateTimeAgo()}
      </span>
    );
  };

  return (
    <div className="p-6 mt-10 bg-white shadow-lg rounded-3xl">
      <h2 className="mb-4 text-xl font-normal font-helvetica">
        Recent Activity
      </h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <div className="flex items-start gap-2 m-4 row">
              <Image
                src={getActivityIcon(activity.type)}
                alt={activity.type}
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <span className="font-medium text-[#5D5D5D]">
                  {activity.description}
                </span>
                <TimeAgo timestamp={activity.timestamp} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecentActivity;
