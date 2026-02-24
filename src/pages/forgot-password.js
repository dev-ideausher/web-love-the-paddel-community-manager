import Button from "@/components/Button";
import Input from "@/components/Input";
import Password from "@/components/Password";
import Link from "@/components/Link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { isRequired } from "@/Utilities/helpers";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase-services/firebase";
import useFirebaseAuth from "@/services/firebase-services/useFirebaseAuth";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import { toast } from "react-toastify";
import { MoveLeft } from "lucide-react";
import { forgotPasswordAPI } from "@/services/api/userAuth";

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("");
    const emailHandler = (e) => {
        setEmail(e.target.value);
    };
    const { forgotPassword } = useFirebaseAuth()

    const handleForgotPassword = async (e) => {

        e.preventDefault();
        setLoading(true)
        try {

            let userAuthData = await forgotPassword(email)
            let apiResponse = await forgotPasswordAPI(email)

            if (userAuthData?.status) {
                router.push("/email-sent")
            }
        }
        catch (err) {
            toast.error(err)
        }
        finally {
            setLoading(false)
        }

    };
    return (
        <div className="login-container">
            <div className="wrapper2">

                <div className=" bg-white rounded-2xl">
                    <div className="py-16 px-10 max-w-lg">
                        <div>
                            <Link href="/"><p className="text-sm inline-flex gap-2 items-center text-[#5D5D5D] font-bold mb-6 rounded-3xl border py-3 px-4 cursor-pointer">
                                <MoveLeft />
                                <span>Back to login</span>
                            </p></Link>
                        </div>

                        <h1 className="text-3xl font-bold text-center mb-6">
                            Recover Password
                        </h1>
                        <p className="text-base font-normal text-grey-5 text-center pb-4 mb-9">Enter your registered email ID below. We will send a password reset link to your registered email ID.</p>
                        <form onSubmit={handleForgotPassword}>

                            <label className="block mb-4">
                                <h2 className="mb-2 text-sm font-medium">Email ID</h2>
                                <div className="flex items-center border rounded-full bg-neutral-1000 px-4 py-2">

                                    <Input
                                        type="email"
                                        placeholder="Enter  your email"
                                        value={email}
                                        onChange={emailHandler}
                                        disabled={loading}
                                        className="w-full outline-none pl-1 "
                                    />
                                </div>
                            </label>
                            <div className="mt-8">
                               
                                <ButtonWithLoader
                                    type="submit"
                                    className={`mt-10 px-20 rounded-[64px] ${email
                                            ? "bg-blue hover:bg-blue/90 cursor-pointer"
                                            : "bg-blue opacity-40 cursor-not-allowed"
                                        }`}
                                    loading={loading}
                                    onClick={handleForgotPassword}
                                    disabled={!email || loading}
                                >
                                    Continue
                                </ButtonWithLoader>

                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}