import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function AuthAction() {
    const router = useRouter();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!router.isReady || hasRedirected.current) return;
        
        const { mode, oobCode } = router.query;
        
        if (mode === "resetPassword" && oobCode) {
            hasRedirected.current = true;
            window.location.href = `/reset-password?oobCode=${oobCode}`;
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
