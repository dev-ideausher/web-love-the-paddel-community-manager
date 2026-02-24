import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthAction() {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const { oobCode } = router.query;
            if (oobCode) {
                router.replace(`/reset-password?oobCode=${oobCode}`);
            }
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
