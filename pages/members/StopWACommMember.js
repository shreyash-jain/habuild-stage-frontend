import { useEffect, useState, Fragment } from "react";

import { RefreshIcon } from "@heroicons/react/outline";

import toast from "react-hot-toast";
import { LeadsApis } from "../../constants/apis";

const StopWACommModal = (props) => {
  const [apiLoading, setApiLoading] = useState();

  const apiCall = (status) => {
    setApiLoading(true);

    const selectedLeadsIds = props.selectedLeads.map((item) => item.id);

    // console.log("Selected Leads ids", selectedLeadsIds);

    if (selectedLeadsIds.length == 0) {
      setApiLoading(false);
      props.setOpen(false);
      toast.error("No Lead selected.");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      lead_member_ids: selectedLeadsIds,
      status,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(LeadsApis.UPDATE_COMM_STATUS, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (result.errorMessage) {
          toast.error(result.errorMessage);
        } else {
          toast.success(result.message);
        }
        props.getPaginatedLeads();
        props.setSelectedLeads([]);
        props.setOpen(false);
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        // console.log("error", error);
      });
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4 p-4 mt-4">
          <div>{props?.selectedLeadsLength} people selected</div>

          <button
            disabled={apiLoading}
            onClick={() => apiCall("PAUSED")}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
            type="submit"
          >
            Stop Communication
            {apiLoading && (
              <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
            )}
          </button>
          <button
            disabled={apiLoading}
            onClick={() => apiCall("ACTIVE")}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
            type="submit"
          >
            Start Communication
            {apiLoading && (
              <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopWACommModal;
