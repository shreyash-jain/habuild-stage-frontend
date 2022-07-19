import { RefreshIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { MemberCSVApis } from "../../constants/apis";

const MemberCSVUpload = (props) => {
  const [apiLoading, setApiLoading] = useState(false);

  // const formSubmit = (e) => {
  //   e.preventDefault();
  //   setApiLoading(true);

  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "multipart/form-data");

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     file: raw,
  //     redirect: "follow",
  //   };
  //   fetch(DemoBatchesApis.CREATE(), requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => {
  //       setApiLoading(false);
  //       props.refreshData();
  //       props.setModalOpen(false);
  //       toast.success("Demo Batch Created");
  //     })
  //     .catch((error) => {
  //       setApiLoading(false);
  //       toast.error("Error");
  //       // console.log("error", error);
  //     });
  // };

  if (apiLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
    );
  }

  return (
    <div className="flex flex-col space-y-8 rounded-lg shadow p-6">
      <div className="flex flex-col">
        {/* <form
          action={MemberCSVApis.UPDATE_MEMBER_DATA()}
          method="post"
          enctype="multipart/form-data"
        > */}
          <label className="font-medium text-gray-700">
            Update Member Data
          </label>
          <input type={"file"} />
          <button>

          </button>
        {/* </form> */}
      </div>
      <div className="flex flex-col">
        <label className="font-medium text-gray-700">
          Update Member Performance Data
        </label>
        <input type={"file"} />
      </div>
      <div className="flex flex-col">
        <label className="font-medium text-gray-700">
          Update Member Attendance Data
        </label>
        <input type={"file"} />
      </div>
    </div>
  );
};

export default MemberCSVUpload;
