import Button from "@/components/Button";
import Password from "@/components/Password";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/services/firebase-services/firebase";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import { toast } from "react-toastify";
import Image from "next/image";

export default function ResetPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [oobCode, setOobCode] = useState("");
    const [fields, setFields] = useState({
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!router.isReady) return;
        const code = router.query.oobCode;
        if (code) {
            verifyResetCode(code);
        } else {
            setVerifying(false);
        }
    }, [router.isReady, router.query]);

    const verifyResetCode = async (code) => {
        try {
            await verifyPasswordResetCode(auth, code);
            setOobCode(code);
            setVerifying(false);
        } catch (error) {
            toast.error("Invalid or expired reset link");
            setVerifying(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!oobCode) {
            toast.error("No reset code provided. Please use the link from your email.");
            return;
        }
        
        if (fields.password !== fields.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (fields.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, fields.password);
            toast.success("Password reset successfully");
            router.push("/");
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Verifying reset link...</p>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="wrapper2">
                <div className="bg-white rounded-2xl">
                    <div className="py-16 px-10 max-w-lg">
                        <div className="mb-6 text-center">
                            <Image
                                src="/images/love_the_padel_logo.png"
                                alt="love_the_padel"
                                width={192}
                                height={48}
                                className="mx-auto"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-6">
                            Reset Password
                        </h1>
                        <p className="text-base font-normal text-grey-5 text-center pb-4 mb-9">
                            Enter your new password below
                        </p>
                        <form onSubmit={handleResetPassword}>
                            <label className="block mb-4">
                                <h2 className="mb-2 text-sm font-medium">New Password</h2>
                                <div className="flex items-center border rounded-full bg-neutral-1000 px-4 py-2">
                                    <Password
                                        placeholder="Enter new password"
                                        value={fields.password}
                                        onChange={(e) => setFields(prev => ({ ...prev, password: e.target.value }))}
                                        disabled={loading}
                                        className="w-full outline-none pl-1"
                                    />
                                </div>
                            </label>

                            <label className="block mb-4">
                                <h2 className="mb-2 text-sm font-medium">Confirm Password</h2>
                                <div className="flex items-center border rounded-full bg-neutral-1000 px-4 py-2">
                                    <Password
                                        placeholder="Confirm new password"
                                        value={fields.confirmPassword}
                                        onChange={(e) => setFields(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        disabled={loading}
                                        className="w-full outline-none pl-1"
                                    />
                                </div>
                            </label>

                            <div className="mt-8">
                                <ButtonWithLoader
                                    type="submit"
                                    className={`mt-10 px-20 rounded-[64px] ${
                                        fields.password && fields.confirmPassword
                                            ? "bg-blue hover:bg-blue/90 cursor-pointer"
                                            : "bg-blue opacity-40 cursor-not-allowed"
                                    }`}
                                    loading={loading}
                                    disabled={!fields.password || !fields.confirmPassword || loading}
                                >
                                    Reset Password
                                </ButtonWithLoader>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
