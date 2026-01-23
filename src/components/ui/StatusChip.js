import { Dot, DotIcon } from "lucide-react";
import React from "react";

const StatusChip = ({ status, className = "" }) => {
  const baseStyles =
    " gap-1 px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset shadow-sm transition-all duration-200 hover:scale-[1.02]";

  const statusStyles = {
    active:
      "border-emerald text-emerald-800 ring-emerald-200/50   shadow-emerald-100/50",
    inactive: "border-rose text-rose-800 ring-rose-200/50  shadow-rose-100/50",
    pending:
      "border-amber text-amber-800 ring-amber-200/50  shadow-amber-100/50",
    draft: "border-blue text-blue-800 ring-blue-200/50  shadow-blue-100/50",
    completed:
      "border-green text-green-800 ring-green-200/50  shadow-green-100/50",
    failed: "border-red text-red-800 ring-red-200/50  shadow-red-100/50",
    cancelled: "border-gray text-gray-800 ring-gray-200/50  shadow-gray-100/50",
  };

  const statusStyle =
    statusStyles[status] ||
    "bg-gray-50/80 text-gray-800 ring-gray-200/50 hover:bg-gray-100  shadow-gray-100/50";

  const dotClass = statusStyles[status]
    ? statusStyles[status]
        .replace(/bg-|text-|ring-|hover:bg-|hover:text-|shadow-/g, "")
        .split(" ")
        .filter(Boolean)[1] || "text-gray-500"
    : "text-gray-500";

  return (
    <div
      className={`max-w-[80px] flex justify-center ${baseStyles} ${statusStyle} ${className}`}
    >
      <div className="flex items-center">
        {" "}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

export default StatusChip;
