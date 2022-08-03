import { useState, useEffect, useContext } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import {
  ShieldCheckIcon,
  RefreshIcon,
  XIcon,
  MenuAlt1Icon,
} from "@heroicons/react/outline";
import { HealthCheckApis } from "../../constants/apis";
import Link from "next/link";
import { ShortenerApis, ProgramsApis, BatchesApis } from "../../constants/apis";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import MenuSidePanel from "./MenuSidePanel";
import HabuildAlerts from "./HabuildAlerts";
import SchedulerInfos from "./SchedulerInfos";
import DayAttendance from "./DayAttendance";
import useCheckAuth from "../../hooks/useCheckAuth";
import { useFetchWrapper } from "../../utils/apiCall";

const Dashboard = () => {
  const checkAuthLoading = useCheckAuth(false);

  const { customFetch, user } = useFetchWrapper();

  const [serverHealthy, setServerHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentYTUrl, setCurrentYTUrl] = useState(
    "https://youtube.com/example"
  );
  const [currentDbYTUrl, setCurrentDbYTUrl] = useState(
    "https://youtube.com/example"
  );
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [memberProgramsWithBatches, setMemberProgramsWithBatches] = useState(
    []
  );

  useEffect(() => {
    apiCall();
    getCurrentYoutubeUrl();
    getMemberBatches();
  }, []);

  const getMemberBatches = async () => {
    // await fetch(`https://api.habuild.in/api/program/`)
    const data = await customFetch(ProgramsApis.GET_PROGRAMS(), "GET", {});

    console.log("Member batches Data", data);

    if (data.programs.length > 0) {
      const programsWithBatches = [];

      for (let i = 0; i < data.programs.length; i++) {
        const result1 = await customFetch(
          BatchesApis.GET_BATCH_FROM_PROGRAM(data.programs[i].id),
          "GET",
          {}
        );
        programsWithBatches.push({
          ...data.programs[i],
          batches: result1.batch,
        });
      }

      setMemberProgramsWithBatches(programsWithBatches);
    }
  };

  const apiCall = async () => {
    setLoading(true);
    const result = await customFetch(HealthCheckApis.GET(), "GET", {});
    // fetch("http://localhost:4000/api/health_check/")
    // .then((res) => res.json())
    // .then((data) => {
    //   if (data.status == 200) {
    //     setServerHealthy(true);
    //   }
    //   setLoading(false);
    // });

    if (result.status == 200) {
      setServerHealthy(true);
    }
    setLoading(false);
  };

  const getCurrentYoutubeUrl = async () => {
    const result = await customFetch(
      ShortenerApis.GET_CURRENT_YT_LINK(),
      "GET",
      {}
    );

    setCurrentYTUrl(result.long_url);
    setCurrentDbYTUrl(result.long_url);
  };

  const updateUrl = async () => {
    if (!window.confirm("Are you sure you want to change current YT url?")) {
      return;
    }

    if (currentYTUrl.length < 15) {
      toast.error("Please Enter valid URL");
      return;
    }

    var raw = {
      newProxyUrl: currentYTUrl,
    };

    const result = await customFetch(
      ShortenerApis.UPDATE_CURRENT_YT_LINK(),
      "PATCH",
      raw
    );

    if (result.ok) {
      toast.success("YT Url Updated!");
      getCurrentYoutubeUrl();
    } else {
      toast.error("Failed to Update YT url.");
    }
  };

  if (checkAuthLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-10 w-10 mx-auto" />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
      <div className="mt-4 flex flex-row space-x-4">
        <div className="border border-gray-100 rounded-md shadow-md p-4  max-w-fit">
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

        <div className="border border-gray-100 rounded-md shadow-md p-4 flex flex-col w-1/2 space-y-2">
          <h1 className="font-semibold text-gray-600">YouTube URL</h1>
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

      <div className="flex sm:space-x-4 flex-col sm:flex-row ">
        <SchedulerInfos customFetch={customFetch} />

        <HabuildAlerts customFetch={customFetch} />
      </div>

      <DayAttendance />

      <button
        onClick={() => setShowMenuSidebar(true)}
        className="transition duration-300 font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-5"
      >
        <MenuAlt1Icon className="w-6 h-6" />
      </button>

      <MenuSidePanel
        customFetch={customFetch}
        open={showMenuSidebar}
        setOpen={setShowMenuSidebar}
        memberProgramsWithBatches={memberProgramsWithBatches}
      />
    </div>
  );
};

Dashboard.getLayout = LayoutSidebar;

export default Dashboard;
