"use client";
import { useEffect, useState } from "react";
import Layout from "@/layout/Layout";
import Loader from "@/components/ui/Loader";
import Link from "@/components/Link";
import { CircleAlert, Mail, MailOpen, Trash, Trash2 } from "lucide-react";
import { formatDate, formatTime } from "@/Utilities/helpers";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { useNotification } from "@/context/NotificationContext";
import Pagination from "@/components/Paignation";
import { useRouter } from "next/router";
import {
  deleteNotifications,
  deletePushNotifications,
  getNotificationsList,
  getPushNotificationsList,
  readUnreadNotification,
  unreadNotification,
} from "@/services/notificationServices";
export default function Index() {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openMail, setOpenMail] = useState(null);
  const { refreshNotifications } = useNotification();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const fetchAllNotifications = async () => {
    setLoading(true);
    const payload = {
      page: pagination.page,
      limit: pagination.limit,
    };
    try {
      const res = await getPushNotificationsList(payload);
      if (res?.status) {
        const allNotifications = res.data.results;
        setNotifications(allNotifications);
        setPagination({
          page: res?.data?.page,
          limit: res?.data?.limit,
          totalPages: res?.data?.totalPages,
        });
      }
    } catch (err) {
      toast.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllNotifications();
  }, [pagination.page, pagination.limit]);

  const toggleMail = async (notificationId) => {
    const target = notifications.find((n) => n._id === notificationId);
    const isCurrentlyRead = target?.isRead;

    const payload = {
      ids: [notificationId],
      markAsRead: !isCurrentlyRead,
    };

    try {
      setLoading(true);

      const res = await readUnreadNotification(payload);
      if (res?.status) {
        await fetchAllNotifications();
        refreshNotifications();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while toggling read/unread.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === notifications.length) {
      setSelected([]);
    } else {
      setSelected(notifications.map((_, index) => index));
    }
  };
  const toggleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleMarkAsRead = async () => {
    if (selected.length === 0) return toast.warn("No notifications selected.");
    const readNotificationIds = selected.map(
      (index) => notifications[index]._id
    );
    const payload = {
      ids: readNotificationIds,
    };

    try {
      const res = await readUnreadNotification(payload);
      if (res?.status) {
        await fetchAllNotifications();
        refreshNotifications();
        setSelected([]);
      } else {
        toast.error("Failed to mark as read.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error marking as read.");
    }
  };

  const handleMarkAsUnread = async () => {
    if (selected.length === 0) return toast.warn("No notifications selected.");

    const unreadNotificationIds = selected.map(
      (index) => notifications[index]._id
    );

    const payload = {
      ids: unreadNotificationIds,
    };

    try {
      const res = await unreadNotification(payload);
      if (res?.status) {
        await fetchAllNotifications();
        refreshNotifications();
        setSelected([]);
      } else {
        toast.error("Failed to mark as unread.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error marking as unread.");
    }
  };

  const handleDeletenotification = async (notificationId = null) => {
    if (!notificationId && selected.length === 0) {
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      const notificationIds = notificationId
        ? [notificationId]
        : selected.map((index) => notifications[index]._id);
      const payload = {
        ids: notificationIds,
      };

      const result = await deletePushNotifications(payload);

      if (result?.status) {
        setNotifications((prev) =>
          prev.filter((item) => !notificationIds.includes(item._id))
        );
        fetchAllNotifications();
        refreshNotifications();

        setSelected([]);
      } else {
        toast.error("Error deleting notification(s).");
      }
    } catch (error) {
      console.error("Error deleting notification(s):", error);
      toast.error(
        "An error occurred while deleting the notification(s). Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const payload = {
          readNotificationIds: [notification._id],
          unreadNotificationIds: [],
        };
        await readUnreadNotification(payload);
        refreshNotifications();
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <Layout title={"Notifications"}>
      <Loader loading={loading} />

      <div>
        {notifications.length === 0 ? (
          <p className="text-sm font-semibold">No notifications available</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 p-3 mt-6 mb-4 bg-white border rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.length === notifications.length}
                  onChange={toggleSelectAll}
                />{" "}
                <span className="text-base font-medium text-primary hover:underline">
                  Select All
                </span>
              </div>

              <div className="flex gap-5">
                <button
                  onClick={handleMarkAsUnread}
                  className="text-base font-medium text-primary hover:underline"
                >
                  Mark as Unread
                </button>
                <button
                  onClick={handleMarkAsRead}
                  className="text-base font-medium text-primary hover:underline"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleDeletenotification()}
                  className="text-base font-medium text-primary hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {notifications.map((item, i) => (
                <li
                  key={i}
                  className={`p-4 border rounded flex justify-between items-start gap-4 ${
                    selected.includes(i)
                      ? "bg-blue-50"
                      : item.isRead
                      ? ""
                      : "bg-gray-50"
                  } hover:bg-gray-50`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => toggleSelect(i)}
                    className="mt-1"
                  />
                  <div className="flex-1 ">
                    <div className="flex justify-between">
                      <h2
                        onClick={() => handleNotificationClick(item)}
                        className={`text-base ${
                          item.isRead
                            ? "font-normal text-gray-500"
                            : "font-semibold text-black4"
                        } hover:text-primary cursor-pointer`}
                      >
                        {item.title}
                      </h2>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMail(item._id)}
                          className="text-lg"
                        >
                          {item.isRead ? (
                            <MailOpen className="text-primary" />
                          ) : (
                            <Mail className="text-primary" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDeletenotification(item._id)}
                          className="text-lg text-red-600"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                    <p className="pt-2 text-sm text-black-2">
                      {item.description}
                    </p>

                    <p className="pt-1 text-sm text-grey-1">
                      {formatDate(item.scheduledAt)}{" "}
                      {formatTime(item.scheduledAt)}{" "}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Pagination pagination={pagination} setPagination={setPagination} />
            {showPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-8 py-10 bg-gray-500 bg-opacity-50">
                <div className="w-full max-w-sm p-4 text-center bg-white rounded shadow-md">
                  <div className="flex justify-center mb-3 text-center">
                    <CircleAlert size={66} absoluteStrokeWidth />
                  </div>
                  <h2 className="pb-2 font-semibold text-xxl"> Oops!</h2>
                  <p className="text-lg font-medium text-black-3">
                    No notification selected to delete !
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button onClick={closePopup}>Close</Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
