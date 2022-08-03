import React, { createContext, useEffect, useState } from "react";
import router from "next/router";
import { LoginApis } from "../constants/apis";
import toast from "react-hot-toast";

export const GlobalContext = React.createContext();

export const GlobalContextProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthLoading(true);
    if (typeof window !== "undefined") {
      const sessionUser = JSON.parse(window.sessionStorage.getItem("user"));

      // console.log("Session Storage ", sessionUser);

      if (sessionUser?.token) setUser(sessionUser);
    }
    setAuthLoading(false);
  }, []);

  const login = async (username, password) => {
    setAuthLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      username,
      password,
      // username: "japneet",
      // password: "J4pneet!",
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(LoginApis.LOGIN(), requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("Login APi Data", data);

        if (data.ok) {
          if (data.data.status == "ACTIVE") {
            router.push("/dashboard");
          }

          window.sessionStorage.setItem("user", JSON.stringify(data.data));
          setUser(data.data);
        } else {
          toast.error(data.error);
        }
        setAuthLoading(false);
      });
  };

  console.log("In Context User", user);

  return (
    <GlobalContext.Provider
      value={{
        user,
        login,
        authLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
