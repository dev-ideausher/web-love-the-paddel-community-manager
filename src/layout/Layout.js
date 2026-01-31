import { cn } from "@/Utilities/cn";
import { getInitials } from "@/Utilities/helpers";
import NotificationDropdown from "@/components/NotificationDropdown";
import Navbar from "@/modules/Navbar";
import { getProfile } from "@/services/profileServices";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Layout({ children, className, title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className={cn("wrapper h-screen overflow-hidden flex", className)}>
        <aside className="sticky top-0 z-40 w-64 h-screen overflow-y-auto shrink-0 overscroll-contain">
          <Navbar />
        </aside>

        <main className="flex-1 h-screen overflow-y-auto">
          <div className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-8 pt-5 pb-5 bg-white shadow-lg">
            <div className="text-center">
              <h1 className="text-xl font-bold text-black-1">{title}</h1>
            </div>
            <div className="flex items-center pt-3 pb-3 pl-4 pr-4 rounded-lg space-x-7 bg-neutral-1000 border-neutral-1000">
              <div className="relative"></div>
            </div>
          </div>

          <div className="w-full px-6 my-4">{children}</div>
        </main>
      </div>
    </>
  );
}
