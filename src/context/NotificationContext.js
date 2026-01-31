import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { getToken } from "@/services/firebase-services/cookies";
import { getUnreadNotifications } from "@/services/notificationServices";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadData, setUnreadData] = useState({
    count: 0,
    unreadNotifications: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const res = await getUnreadNotifications();
      if (res?.status) {
        setUnreadData(res.data);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{ unreadData, loading, refreshNotifications: fetchUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
