import { getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";
import { app } from "./firebase";
import { getAuthToken } from "../api/helper";
import { subscribeNotifications } from "../notificationServices";

let isTokenBeingGenerated = false;

export const generateFCMToken = async () => {
  const existingToken = Cookies.get("fcmToken");
  if (existingToken) {
    return existingToken;
  }

  if (isTokenBeingGenerated) {
    return null;
  }

  isTokenBeingGenerated = true;

  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.error("Notification not supported by browser.");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.error("Notification permission denied.");
      return null;
    }

    const messaging = getMessaging(app);
    const authToken = await getAuthToken();

    if (!authToken) {
      console.error("Auth token not found.");
      return null;
    }

    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });

    if (!fcmToken) {
      console.error("Failed to generate FCM token.");
      return null;
    }
    const response = await subscribeNotifications({ fcmToken });

    if (response?.status) {
      Cookies.set("fcmToken", fcmToken, { path: "/" });
    } else {
      console.error("Failed to subscribe FCM token:", response);
    }

    return fcmToken;
  } catch (error) {
    console.error("generateFCMToken error:", error);
    throw error;
  } finally {
    isTokenBeingGenerated = false;
  }
};
