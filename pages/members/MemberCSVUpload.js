import { RefreshIcon } from "@heroicons/react/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { MemberCSVApis } from "../../constants/apis";

const MemberCSVUpload = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [memberDataFile, setMemberDataFile] = useState({});
  const [performanceFile, setPerformanceFile] = useState({});
  const [attendanceFile, setAttendanceFile] = useState({});

  const formSubmit = (calledFrom) => {
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

    let formData = new FormData();
    formData.append("file", file);

    var requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };
    fetch(API, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Result", result);
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
      })
      .catch((error) => {
        setApiLoading(false);
        toast.error("Error");
        // console.log("error", error);
      });
  };

  if (apiLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
    );
  }

  console.log(attendanceFile);
  console.log(memberDataFile);

  return (
    <div className="flex flex-col space-y-8 rounded-lg shadow p-6">
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Update Member Data</label>
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
