import { useState, useEffect } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import { ShieldCheckIcon, RefreshIcon, XIcon } from "@heroicons/react/outline";
import { HealthCheckApis } from "../constants/apis";
import Link from "next/link";
import { ShortenerApis } from "../constants/apis";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [serverHealthy, setServerHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentYTUrl, setCurrentYTUrl] = useState(
    "https://youtube.com/example"
  );
  const [currentDbYTUrl, setCurrentDbYTUrl] = useState(
    "https://youtube.com/example"
  );

  useEffect(() => {
    apiCall();
    getCurrentYoutubeUrl();
  }, []);

  const apiCall = () => {
    setLoading(true);
    fetch(HealthCheckApis.GET())
      // fetch("http://localhost:4000/api/health_check/")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          setServerHealthy(true);
        }
        setLoading(false);
      });
  };

  const getCurrentYoutubeUrl = async () => {
    fetch(ShortenerApis.GET_CURRENT_YT_LINK())
      .then((res) => res.json())
      .then((data) => {
        setCurrentYTUrl(data.long_url);
        setCurrentDbYTUrl(data.long_url);
      });
  };

  const updateUrl = async () => {
    if (!window.confirm("Are you sure you want to change current YT url?")) {
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      newProxyUrl: currentYTUrl,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(ShortenerApis.UPDATE_CURRENT_YT_LINK(), requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success("YT Url Updated!");
          getCurrentYoutubeUrl();
        } else {
          toast.error("Failed to Update YT url.");
        }
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
      <div className="p-4 flex flex-row space-x-4">
        <div className="rounded-md shadow-md p-4  max-w-fit">
          <h1 className=" font-semibold text-gray-600">
            Server Health Check
            {loading && (
              <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
            )}
          </h1>

          {serverHealthy ? (
            <div className="flex flex-row mt-4 ">
              <ShieldCheckIcon className="text-green-400 h-8 w-8" />
              <span className="font-bold text-gray-500 ">
                Server Health OK!
              </span>
            </div>
          ) : (
            <div>
              <XIcon className="text-red-400 h-8 w-8" />
              <span className="font-bold text-gray-500">
                Something is Wrong with Server!
              </span>
            </div>
          )}

          <button
            className="py-1 px-3 text-sm rounded-md bg-green-300 text-green-600 hover:bg-green-600 hover:text-white font-bold"
            onClick={apiCall}
          >
            Recheck Health
          </button>
        </div>

        <div className="rounded-md shadow-md p-4 flex flex-col w-1/2 space-y-2">
          <input
            type="text"
            className="px-2 py-1 rounded-md border-gray-400 border w-full text-gray-800"
            value={currentYTUrl}
            onChange={(e) => setCurrentYTUrl(e.target.value)}
          />

          <button
            onClick={updateUrl}
            className="px-3 py-1.5 max-w-fit rounded-md bg-green-300 hover:bg-green-600 font-medium text-green-600 hover:text-white"
          >
            Update YT Url
          </button>

          <Link href={currentDbYTUrl}>
            <a
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
            >
              {currentDbYTUrl}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = LayoutSidebar;

export default Dashboard;
