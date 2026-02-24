import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthAction() {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady && router.query.oobCode) {
            const oobCode = router.query.oobCode;
            window.location.href = `/reset-password?oobCode=${oobCode}`;
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to reset password page...</p>
        </div>
    );
}
