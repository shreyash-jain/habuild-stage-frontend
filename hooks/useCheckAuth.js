import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GlobalContext } from "../context/GlobalContextProvider";
import { useContext } from "react";

export default function useCheckAuth(onAuthenticated, redirectTo = "/") {
  const router = useRouter();

  const { authLoading, login, user } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (onAuthenticated) {
      if (user?.token) {
        router.push(redirectTo);
      } else {
        setLoading(false);
      }
    } else {
      if (user?.token) {
        setLoading(false);
      } else {
        router.push(redirectTo);
      }
    }
  }, [user?.token]);

  return loading;
}
