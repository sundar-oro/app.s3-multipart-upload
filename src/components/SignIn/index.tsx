"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import { errorPopper, successPopper } from "./Toastmessage";
// import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { encode } from "string-encode-decode";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/Modules/userlogin/userlogin.slice";
import { RootState, store } from "@/redux";

const SignInPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);

  const setUserDetailsInCookies = ({ access_token, user_details }: any) => {
    const details: any = jwt.decode(access_token);
    const encodedString = access_token;

    Cookies.set("token", access_token, {
      priority: "High",
      expires: details["exp"],
    });
  };

  const fetchData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(data, "dtaat");
      setUserDetailsInCookies(data?.data);
      dispatch(
        loginSuccess({
          user: data.data,
          token: data.data.access_token,
        })
      );

      console.log("Stored User State:", store.getState());
      router.push("/dashboard");

      console.log("API Response Data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-[700px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={fetchData} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              onClick={fetchData}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          {errors && <p style={{ color: "red" }}>{errors}</p>}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden bg-muted lg:block w-[758px] h-[698px]">
        <Image
          src="/dashboard/desktopimage.svg"
          alt="Image"
          width="1920"
          height="1000"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default SignInPage;
