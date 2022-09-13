import { useState, useEffect } from "react";
import {  StaticDataApis } from "../../constants/apis";
import { RefreshIcon } from "@heroicons/react/outline";
import Image from "next/image";
import toast from "react-hot-toast";

const DefaultRegistration = (props) => {
  const [defaultChannel, setDefaultChannel] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    getDefaultChannel();
  }, []);

  const getDefaultChannel = async () => {
    setLoading(true);

    setLoading(true);
    const data = await props.customFetch(
      StaticDataApis.GET_REGISTRATION_CHANNEL(),
      "GET",
      {}
    );
    setLoading(false);
    setDefaultChannel(data.data.value);
  };

  const updateChannel = async (newChannel) => {
    if (defaultChannel == newChannel) {
      toast.error("Channel cannot be same as current Default Channel.");
      return;
    }

    setLoading(true);

    if (!window.confirm("Are you sure?")) {
      return;
    }

    const result = await props.customFetch(
      StaticDataApis.UPDATE_REGISTRATION_CHANNEL(),
      "PATCH",
      {
        newRegisterationChannel: newChannel,
      }
    );

    if (result.ok) {
      toast.success("Updated default registration channel");
      getDefaultChannel();
    } else {
      toast.error("Failed");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="mt-8 border border-gray-100 shadow-md rounded-md p-2 max-w-fit">
        <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="mt-8 border border-gray-100 shadow-md rounded-md p-2 max-w-fit">
      <h1 className="text-lg font-medium text-gray-900">
        Default Registration Channel
      </h1>

      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">
            Current default registration channel -{" "}
          </h2>
          <h1 className="font-bold text-xl text-gray-800">{defaultChannel}</h1>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div
            title="Change channel to ZOOM."
            onClick={() => updateChannel("ZOOM")}
            className={`${
              defaultChannel === "ZOOM" ? "opacity-100" : "opacity-40"
            } grid place-content-center transition duration-300 p-2 border border-gray-100 hover:opacity-100 hover:cursor-pointer hover:shadow-md rounded-md shadow-sm`}
          >
            <Image
              layout="fixed"
              width={75}
              height={30}
              src="/assets/zoom_logo.png"
            />
          </div>

          <div
            title="Change channel to YOUTUBE."
            onClick={() => updateChannel("YOUTUBE")}
            className={`${
              defaultChannel === "YOUTUBE" ? "opacity-100" : "opacity-40"
            } grid place-content-center transition duration-300 p-2 border border-gray-100 hover:opacity-100 hover:cursor-pointer hover:shadow-md rounded-md shadow-sm`}
          >
            <Image
              className="hover:cursor-pointer hover:shadow-md shadow-sm"
              layout="fixed"
              width={75}
              height={19}
              src="/assets/youtube_logo.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultRegistration;
