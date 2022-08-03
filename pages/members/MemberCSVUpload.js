import { RefreshIcon, DownloadIcon } from "@heroicons/react/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { MemberCSVApis } from "../../constants/apis";

const MemberCSVUpload = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [memberDataFile, setMemberDataFile] = useState({});
  const [performanceFile, setPerformanceFile] = useState({});
  const [attendanceFile, setAttendanceFile] = useState({});

  const formSubmit = async (calledFrom) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    setApiLoading(true);
    let API;
    let file;

    if (calledFrom == "data") {
      API = MemberCSVApis.UPDATE_MEMBER_DATA();
      file = memberDataFile;
    }

    if (calledFrom == "performance") {
      API = MemberCSVApis.UPDATE_MEMBER_PERFORMANCE();
      file = performanceFile;
    }

    if (calledFrom == "attendance") {
      API = MemberCSVApis.UPDATE_MEMBER_ATTENDANCE();
      file = attendanceFile;
    }

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const result = await props.customFetchFile(API, "POST", file);
      // console.log("Result", result);
      setApiLoading(false);
      if (result.status == 200) {
        toast.success(result.message);
      } else {
        if (result?.message) {
          toast.error(result.message);
        } else {
          toast.error("Error");
        }
      }
      // props.refreshData();
      // props.setModalOpen(false);
    } catch (error) {
      setApiLoading(false);
      toast.error("Error");
      // console.log("error", error);
    }
  };

  if (apiLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
    );
  }

  return (
    <div className="flex flex-col space-y-12 rounded-lg shadow p-6">
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Update Member Data</label>
        <a
          href="/assets/Member_data_template.csv"
          download={"Member_data_template.csv"}
          className="text-gray-600 flex flex-row px-3 py-1 text-sm font-medium rounded-md max-w-fit hover:bg-gray-200"
        >
          <DownloadIcon className="w-4 h-4 mr-2" /> Download Member Data
          Template
        </a>
        <input
          onChange={(e) => setMemberDataFile(e.target.files[0])}
          type={"file"}
        />
        <button
          onClick={() => formSubmit("data")}
          className="max-w-fit px-3 py-2 text-green-700 bg-green-300 hover:text-white hover:bg-green-700 font-medium rounded-md"
        >
          Update Member Data
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Update Member Performance Data
        </label>
        <a
          href="/assets/Member_performance_template.csv"
          download={"Member_performance_template.csv"}
          className="text-gray-600 flex flex-row px-3 py-1 text-sm font-medium rounded-md max-w-fit hover:bg-gray-200"
        >
          <DownloadIcon className="w-4 h-4 mr-2" /> Download Member Performance
          Template
        </a>
        <input
          onChange={(e) => setPerformanceFile(e.target.files[0])}
          type={"file"}
        />
        <button
          onClick={() => formSubmit("performance")}
          className="max-w-fit px-3 py-2 text-green-700 bg-green-300 hover:text-white hover:bg-green-700 font-medium rounded-md"
        >
          Update Member Performance
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Update Member Attendance Data
        </label>
        <a
          href="/assets/Member_Attendance_template.csv"
          download={"Member_Attendance_template.csv"}
          className="text-gray-600 flex flex-row px-3 py-1 text-sm font-medium rounded-md max-w-fit hover:bg-gray-200"
        >
          <DownloadIcon className="w-4 h-4 mr-2" /> Download Member Attendance
          Template
        </a>
        <input
          onChange={(e) => setAttendanceFile(e.target.files[0])}
          type={"file"}
        />
        <button
          onClick={() => formSubmit("attendance")}
          className="max-w-fit px-3 py-2 text-green-700 bg-green-300 hover:text-white hover:bg-green-700 font-medium rounded-md"
        >
          Update Member Attendance Data
        </button>
      </div>
    </div>
  );
};

export default MemberCSVUpload;
