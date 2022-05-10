import { useEffect, useState } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import { ShieldCheckIcon, RefreshIcon, XIcon } from "@heroicons/react/outline";

const ServerHealthCheck = (props) => {
  const [serverHealthy, setServerHealthy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = () => {
    setLoading(true);
    fetch("https://api.habuild.in/api/health_check/")
      // fetch("http://localhost:4000/api/health_check/")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          setServerHealthy(true);
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Server Health Check
        {loading && (
          <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
        )}
      </h1>

      {serverHealthy ? (
        <div className="flex flex-row mt-4 ">
          <ShieldCheckIcon className="text-green-400 h-8 w-8" />
          <span className="font-bold text-gray-500 ">Server Health OK!</span>
        </div>
      ) : (
        <div>
          <XIcon className="text-red-400 h-8 w-8" />
          <span className="font-bold text-gray-500">
            Something's Wrong with Server!
          </span>
        </div>
      )}

      <button
        className="py-2 px-4 rounded-md bg-green-300 text-green-600 hover:bg-green-600 hover:text-white font-bold"
        onClick={apiCall}
      >
        Recheck Health
      </button>
    </div>
  );
};

ServerHealthCheck.getLayout = LayoutSidebar;

export default ServerHealthCheck;
