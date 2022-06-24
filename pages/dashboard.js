import { useState, useEffect } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import { ShieldCheckIcon, RefreshIcon, XIcon } from "@heroicons/react/outline";
import { HealthCheckApis } from "../constants/apis";

const Dashboard = () => {
  const [serverHealthy, setServerHealthy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall();
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>

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
            <span className="font-bold text-gray-500 ">Server Health OK!</span>
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
    </div>
  );
};

Dashboard.getLayout = LayoutSidebar;

export default Dashboard;
