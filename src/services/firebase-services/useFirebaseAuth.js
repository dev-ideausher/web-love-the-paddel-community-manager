import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  signInWithPopup,
  RecaptchaVerifier,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
  getAuth,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import { removeToken, removeUser } from "./cookies";
import { firebaseErrorFinder } from "@/services/firebase-services/firebaseerrors";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function useFirebaseAuth() {
  const router = useRouter();

  const loginWithEmailAndPassword = async (email, password, redirect = "") => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified && redirect != "") {
        router.push(redirect);
        return { status: false };
      }
      const expiryTime = new Date(Date.now() + 3600 * 1000);
      const token = auth.currentUser.accessToken;
      return { status: true, user: auth.currentUser, token: token, expiryTime };
    } catch (e) {
      const error = firebaseErrorFinder[e.code]
        ? firebaseErrorFinder[e.code]
        : "Somthing went wrong during authentication please refresh and retry";
      toast.error(error, {
        toastId: "firebase-error",
      });
      return { status: false, error: error };
    }
  };

  const logOut = async () => {
    try {
      const res = await signOut(auth);
      removeToken();
      removeUser();
      router.push("/");
      return { status: true };
    } catch (e) {
      const error = firebaseErrorFinder(e.code);
      toast.error(error, {
        toastId: "firebase-error",
      });
      return { status: false, error: error };
    }
  };
  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, redirectUrl: window.location.origin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset password email");
      }

      toast.success("Reset password email has been sent successfully", {
        toastId: "firebase-reset-password-sent-message",
      });
      return {
        status: true,
        message: "Reset password email has been sent successfully",
      };
    } catch (e) {
      const error = e.message || "Something went wrong during authentication please refresh and retry";
      toast.error(error, {
        toastId: "firebase-error",
      });
      return { status: false, error: error };
    }
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is currently signed in.");
      return { success: false, message: "No user is currently signed in." };
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error("Error updating password:", error.message);
      return { success: false, message: error.message };
    }
  };

  return {
    logOut,
    loginWithEmailAndPassword,
    forgotPassword,
    updateUserPassword,
  };
}
