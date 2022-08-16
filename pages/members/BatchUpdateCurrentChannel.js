import { useState } from "react";
import { BatchesApis } from "../../constants/apis";
import Image from "next/image";
import toast from "react-hot-toast";

const BatchUpdateCurrentChannel = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [currentChannel, setCurrentChannel] = useState("");

  const updateCurrentChannel = async () => {
    if (!currentChannel) {
      toast.error("Please Select a channel");
      return;
    }

    if (!selectedBatch) {
      toast.error("Please Select a Batch");
      return;
    }

    if (
      !window.confirm(
        `Set Current Channel to ${currentChannel} for Selected Batch?`
      )
    ) {
      return;
    }

    setApiLoading(true);

    const result = await props.customFetch(
      BatchesApis.UPDATE_MEMBERS_CURRENT_CHANNEL(selectedBatch),
      "PATCH",
      { memberStatuses: ["ACTIVE", "PAUSED"], currentChannel: currentChannel }
    );

    if (result.ok) {
      toast.success("Successfully Updated Current Channel for Batch");
      props.getPaginatedLeads();
      setSelectedBatch("");
      setCurrentChannel("");
    } else {
      toast.error("Error");
    }

    setApiLoading(false);
  };

  const fallbackToPrefferedChannel = async () => {
    if (!selectedBatch) {
      toast.error("Please Select a Batch");
      return;
    }

    if (!window.confirm(`Are you sure?`)) {
      return;
    }

    setApiLoading(true);

    const result = await props.customFetch(
      BatchesApis.FALL_BACK_PREF_CHANNEL(selectedBatch),
      "PATCH",
      { memberStatuses: ["ACTIVE", "PAUSED"] }
    );

    if (result.ok) {
      toast.success("Successfully Updated Current Channel for Batch");
      props.getPaginatedLeads();
      setSelectedBatch("");
      setCurrentChannel("");
    } else {
      toast.error("Error");
    }

    setApiLoading(false);
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-4">
        {props.memberProgramsWithBatches?.map((program, personIdx) => (
          <fieldset key={program.id} className="rounded-md p-4 shadow-md">
            <div className="relative flex items-start py-4">
              <div className="min-w-0 flex-1 text-sm">
                <legend className="text-lg font-medium text-gray-900">
                  {program.title}
                </legend>
              </div>
            </div>
            {program.batches?.map((batch) => {
              const checked = selectedBatch == batch.id ? true : false;
              return (
                <div
                  key={batch.id}
                  className="mt-4 border-b border-gray-200 divide-y divide-gray-200"
                >
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <label
                        htmlFor={`person-${batch.id}`}
                        className="font-medium text-gray-700 select-none"
                      >
                        {batch.name}
                      </label>
                    </div>
                    <div className="ml-3 flex items-center h-5">
                      <input
                        disabled={apiLoading}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setSelectedBatch("");
                          } else {
                            setSelectedBatch(batch.id);
                          }
                        }}
                        id={`person-${batch.id}`}
                        name={`person-${batch.id}`}
                        checked={checked}
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </fieldset>
        ))}

        <button
          disabled={apiLoading}
          onClick={() => {
            fallbackToPrefferedChannel();
          }}
          className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
        >
          Fallback to Preffered Channel
        </button>

        <div className="mt-6 space-y-4">
          <div
            title="Change channel to ZOOM."
            onClick={() => setCurrentChannel("ZOOM")}
            className={`${
              currentChannel === "ZOOM" ? "opacity-100" : "opacity-40"
            } grid place-content-center transition duration-300 p-2 border border-gray-100 hover:opacity-100 hover:cursor-pointer hover:shadow-md rounded-md shadow-sm`}
          >
            <Image
              layout="fixed"
              width={150}
              height={60}
              src="/assets/zoom_logo.png"
            />
          </div>

          <div
            title="Change channel to YOUTUBE."
            onClick={() => setCurrentChannel("YOUTUBE")}
            className={`${
              currentChannel === "YOUTUBE" ? "opacity-100" : "opacity-40"
            } grid place-content-center transition duration-300 p-2 border border-gray-100 hover:opacity-100 hover:cursor-pointer hover:shadow-md rounded-md shadow-sm`}
          >
            <Image
              className="hover:cursor-pointer hover:shadow-md shadow-sm"
              layout="fixed"
              width={150}
              height={38}
              src="/assets/youtube_logo.jpg"
            />
          </div>
        </div>

        <button
          disabled={apiLoading}
          onClick={() => {
            updateCurrentChannel();
          }}
          className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
        >
          Update Channel
        </button>
      </div>
    </div>
  );
};

export default BatchUpdateCurrentChannel;
