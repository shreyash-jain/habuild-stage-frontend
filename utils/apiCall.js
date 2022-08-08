import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContextProvider";
import useCheckAuth from "../hooks/useCheckAuth";

export const useFetchWrapper = () => {
  // const checkAuthLoading = useCheckAuth(false);
  const checkAuthLoading = false;

  const { user } = useContext(GlobalContext);

  const customFetch = async (api, method, body) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `Bearer ${user?.token}`);

    var requestOptions = {
      method,
      headers: myHeaders,
      redirect: "follow",
    };

    if (Object.keys(body)?.length > 0) {
      requestOptions = { ...requestOptions, body: JSON.stringify(body) };
    }

    const result = await fetch(api, requestOptions).then((res) => res.json());

    return result;
  };

  const customFetchFile = async (api, method, file) => {
    var myHeaders = new Headers();

    // myHeaders.append("Authorization", `Bearer ${user?.token}`);

    let formData = new FormData();
    formData.append("file", file);

    var requestOptions = {
      method,
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    const result = await fetch(api, requestOptions).then((res) => res.json());

    return result;
  };

  if (checkAuthLoading) {
    return false;
  }

  return {
    customFetch,
    user,
    customFetchFile,
  };
};
