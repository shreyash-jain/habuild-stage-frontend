import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoginApis } from "../constants/apis";
import { GlobalContext } from "../context/GlobalContextProvider";
import { useContext } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import useCheckAuth from "../hooks/useCheckAuth";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const { authLoading, login } = useContext(GlobalContext);
  const checkAuthLoading = useCheckAuth(true, "/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (checkAuthLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-10 w-10 mx-auto" />
    );
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/habuild_logo_big.png"
            alt="Workflow"
          />
          <h2
            style={{ color: "#6E6E6E" }}
            className="mt-6 text-center text-3xl font-bold"
          >
            
            CRM
          </h2>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            Sign in
            {/* <span onClick={() => router.push("/dashboard")}>in </span> */}
            to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (email && password) {
                  login(email, password);
                } else {
                  toast.error("Username or password missing");
                  return;
                }
                // if (email == "admin@Habuild.in" && password == "admin") {
                // router.push("/dashboard");
                // } else {
                //   alert("Wrong email / password.");
                //   return;
                // }
              }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    // autoComplete="current-password"
                    // required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    Forgot your password?
                  </a>
                </div> */}
              </div>

              <div>
                {/* {authLoading ? (
                  <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
                ) : ( */}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign in
                </button>
                {/* )} */}
              </div>
            </form>

            <div className="mt-6">
              <div className="mt-6 grid grid-cols-3 gap-3"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
