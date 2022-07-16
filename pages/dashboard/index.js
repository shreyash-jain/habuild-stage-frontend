import { useState, useEffect } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import {
  ShieldCheckIcon,
  RefreshIcon,
  XIcon,
  MenuAlt1Icon,
} from "@heroicons/react/outline";
import { HealthCheckApis } from "../../constants/apis";
import Link from "next/link";
import {
  ShortenerApis,
  SchedulerApis,
  ProgramsApis,
  BatchesApis,
} from "../../constants/apis";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import MenuSidePanel from "./MenuSidePanel";

const Dashboard = () => {
  const [serverHealthy, setServerHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentYTUrl, setCurrentYTUrl] = useState(
    "https://youtube.com/example"
  );
  const [currentDbYTUrl, setCurrentDbYTUrl] = useState(
    "https://youtube.com/example"
  );
  const [schedulerInfos, setSchedulerInfos] = useState([]);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [memberProgramsWithBatches, setMemberProgramsWithBatches] = useState(
    []
  );
  const [showSchedulerInfoModal, setShowSchedulerInfoModal] = useState(false);
  const [unsuccessfullSchedulers, setUnsuccessfullSchedulers] = useState([]);

  useEffect(() => {
    apiCall();
    getCurrentYoutubeUrl();
    getSchedulersInfos();
    getMemberBatches();
  }, []);

  const getMemberBatches = async () => {
    // await fetch(`https://api.habuild.in/api/program/`)
    await fetch(ProgramsApis.GET_PROGRAMS())
      .then((res) => res.json())
      .then(async (data) => {
        if (data.programs.length > 0) {
          const programsWithBatches = [];

          for (let i = 0; i < data.programs.length; i++) {
            await fetch(BatchesApis.GET_BATCH_FROM_PROGRAM(data.programs[i].id))
              .then((res) => res.json())
              .then((data1) => {
                programsWithBatches.push({
                  ...data.programs[i],
                  batches: data1.batch,
                });
              });
          }

          setMemberProgramsWithBatches(programsWithBatches);
        }
      });
  };

  const getSchedulersInfos = () => {
    setLoading(true);

    fetch(SchedulerApis.GET())
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSchedulerInfos(data.message);

        const notSuccessfulSchedulers = data.message.filter((item) => {
          if (item.status !== "SUCCESS") {
            return item;
          }
        });

        setUnsuccessfullSchedulers(notSuccessfulSchedulers);

        setLoading(false);
      });
  };

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

    if (currentYTUrl.length < 15) {
      toast.error("Please Enter valid URL");
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

  const columns = [
    {
      title: "Scheduler Id",
      dataIndex: "scId",
      key: "scId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Last Run",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (!status) {
          return <p className="text-gray-800">Status not Found</p>;
        }
        return (
          <span
            className={`text-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
              status == "SUCCESS"
                ? "bg-green-300 text-green-800"
                : "bg-red-300 text-red-800"
            }  `}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Last Run Date",
      dataIndex: "latestDate",
      key: "latestDate",
      render: (date) => {
        if (!date) {
          return "-";
        }

        return date.split("T")[0];
      },
    },
    {
      title: "Last Start Time",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        if (!date) {
          return "-";
        }

        return date.split("T")[1];
      },
    },
    {
      title: "Last Stop Time",
      dataIndex: "stopDate",
      key: "stopDate",
      render: (date) => {
        if (!date) {
          return "-";
        }

        return date.split("T")[1];
      },
    },
  ];

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

      <div className="mt-8 border border-gray-100 shadow-md rounded-md p-2 max-w-fit">
        <h1 className="text-lg font-medium text-gray-900">Schedulers Info</h1>

        {unsuccessfullSchedulers.length > 0 && (
          <h1 className="text-lg font-medium text-red-500">
            {unsuccessfullSchedulers.length} Unsuccessfull Schedulers
          </h1>
        )}
        <div className="text-gray-700">
          {unsuccessfullSchedulers.map((item) => {
            return (
              <span key={item.id}>
                {item.name} - {item.status ? item.status : "Status not found"}
              </span>
            );
          })}
        </div>

        <button
          onClick={() => setShowSchedulerInfoModal(true)}
          className="hover:text-white hover:bg-green-600 mt-2 rounded-md px-3 py-1 font-medium text-green-700 bg-green-300"
        >
          View All
        </button>
      </div>

      <Modal
        modalOpen={showSchedulerInfoModal}
        setModalOpen={setShowSchedulerInfoModal}
        hideActionButtons
      >
        <Table
          dataLoading={loading}
          // onPaginationApi={getMembers}
          // totalRecords={totalRecords}
          columns={columns}
          // pagination
          dataSource={schedulerInfos}
          // currentPagePagination={currentPagePagination}
        />
      </Modal>

      <button
        onClick={() => setShowMenuSidebar(true)}
        className="transition duration-300 font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-5"
      >
        <MenuAlt1Icon className="w-6 h-6" />
      </button>

      <MenuSidePanel
        open={showMenuSidebar}
        setOpen={setShowMenuSidebar}
        memberProgramsWithBatches={memberProgramsWithBatches}
      />
    </div>
  );
};

Dashboard.getLayout = LayoutSidebar;

export default Dashboard;
