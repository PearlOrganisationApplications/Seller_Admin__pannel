import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDWQnPEAyc...",
  authDomain: "kalkideals-e2989.firebaseapp.com",
  projectId: "kalkideals-e2989",
  storageBucket: "kalkideals-e2989.firebasestorage.app",
  messagingSenderId: "945087473651",
  appId: "1:945087473651:web:498fc86b6006a5e98fd486",
  measurementId: "G-D92STZV6SS",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export { app, analytics };

export const requestFCMToken = async () => {
  try {
    // 1. Browser check
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("Notification API not supported");
      return null;
    }

    // 2. Permission
    const permission = await Notification.requestPermission();

    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // 3. Get messaging instance only when needed
    const messaging = getMessaging(app);

    // 4. Get FCM token
    const token = await getToken(messaging, {
      vapidKey:
        "BMVUTr2QdcWdk3SBJi2mEw16BxRO64H1ff8VShoLspo57QLk-tu_kpzSudzBbUcIp8GBEqlMNGfrTko5XPJKQxg",
    });

    console.log("🔥 FCM Token:", token);

    if (!token) {
      console.log("FCM token was not generated");
      return null;
    }

    return token;
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};