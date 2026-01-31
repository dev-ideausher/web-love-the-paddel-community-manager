import Button from "@/components/Button";
import Input from "@/components/Input";
import Password from "@/components/Password";
import Link from "@/components/Link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useFirebaseAuth from "@/services/firebase-services/useFirebaseAuth";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import { toast } from "react-toastify";
import { setToken, setUser } from "@/services/firebase-services/cookies";
import { userLogin } from "@/services/api/userAuth";
import Image from "next/image";
export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const { loginWithEmailAndPassword } = useFirebaseAuth();
  const emailHandler = (e) => {
    setFields((prev) => ({ ...prev, email: e.target.value }));
  };
  const passwordHandler = (e) => {
    setFields((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userAuthData = await loginWithEmailAndPassword(
        fields.email,
        fields.password,
      );
      console.log("triggered", userAuthData);

      if (userAuthData?.status) {
        let userData = await userLogin(userAuthData.token);

        if (userData.status) {
          setToken(userAuthData.token, userAuthData.expiryTime);
          setUser(userData.data);
          toast.success("Login successful");
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-center bg-cover login-container"
      style={{ backgroundImage: 'url("/images/login_bg.png")' }}
    >
      <div className="wrapper2">
        <div className="w-full max-w-lg p-10 ">
          <div className="mb-6 text-center">
            <Image
              src="/images/love_the_padel_logo.png"
              alt="love_the_padel"
              width={192}
              height={48}
              className="mx-auto"
            />
          </div>
          <div className="bg-white rounded-2xl">
            <div className="max-w-lg px-10 py-12">
              <h2 className="mb-10 text-3xl text-center">Login</h2>

              <form onSubmit={handleLogin}>
                <label className="block mb-4">
                  <h2 className="mb-2 text-sm font-medium text-black-1">
                    Email Id
                  </h2>
                  <div className="flex items-center px-4 py-2 border rounded-full bg-neutral-1000">
                    <Input
                      type="email"
                      placeholder="Enter Email Id"
                      value={fields.email}
                      onChange={emailHandler}
                      disabled={loading}
                      className="w-full pl-1 outline-none "
                    />
                  </div>
                </label>

                <label className="block mb-4">
                  <h2 className="mb-2 text-sm font-medium text-black-1">
                    Password
                  </h2>

                  <div className="flex items-center px-4 py-2 border rounded-full bg-neutral-1000">
                    <Password
                      placeholder="Enter Password"
                      value={fields.password}
                      onChange={passwordHandler}
                      iconType="post"
                      disabled={loading}
                      className="w-full pl-1 outline-none"
                    />
                  </div>
                </label>

                <div className="flex items-center justify-end mb-10">
                  <Link
                    href="/forgot-password"
                    passHref
                    className="text-sm font-normal cursor-pointer text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                {/* <div
                  onClick={() => router.push("/forgot-password")}
                  className="flex justify-end w-full mt-4"
                >
                  <span className="text-primary font-medium leading-[150%] text-sm cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </div> */}
                <ButtonWithLoader
                  type="submit"
                  className={`mt-10 px-20 rounded-[64px] ${
                    fields.email && fields.password
                      ? "bg-blue hover:bg-blue/90 cursor-pointer"
                      : "bg-blue opacity-40 cursor-not-allowed"
                  }`}
                  loading={loading}
                  onClick={handleLogin}
                  disabled={!fields.email || !fields.password || loading}
                >
                  Login
                </ButtonWithLoader>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
