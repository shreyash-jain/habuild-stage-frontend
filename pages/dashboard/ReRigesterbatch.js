import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ReRegisterApis } from "../../constants/apis";
import { RefreshIcon } from "@heroicons/react/outline";

const ReRegisterBatch = (props) => {
  const [selectedBatches, setSelectedbatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectBatches = (checked, id) => {
    // console.log("OnChange Called");
    const newBatchIds = [...selectedBatches];

    if (checked) {
      newBatchIds.push(id);
    } else {
      const indexToRemove = newBatchIds.indexOf(id);
      newBatchIds.splice(indexToRemove, 1);
    }

    setSelectedbatches(newBatchIds);
  };

  const selectAllBatches = (checked, demoBatches) => {
    const newBatchIds = [...selectedBatches];

    if (checked) {
      for (let i = 0; i < demoBatches.length; i++) {
        newBatchIds.push(demoBatches[i].id);
      }
    } else {
      newBatchIds = [];
    }

    setSelectedbatches(newBatchIds);
  };

  const onClick = () => {
    setLoading(true);
    if (selectedBatches.length == 0) {
      setLoading(false);
      toast.error("Please select atleast one batch to reregister.");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      batchIds: selectedBatches,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(ReRegisterApis.BATCH(), requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status == 500) {
          toast.error("Failed to Re-Register batches.");
        }
        toast.success("Re-Registered batches Successfully.");
        console.log("DATAAAA", data);
      });
  };

  return (
    <div className="flex flex-col space-y-4">
      {props.memberProgramsWithBatches?.map((program, personIdx) => (
        <fieldset key={program.id} className="rounded-md p-4 shadow-md">
          <div className="relative flex items-start py-4">
            <div className="min-w-0 flex-1 text-sm">
              <legend className="text-lg font-medium text-gray-900">
                {program.title}
              </legend>
            </div>
            <div className="ml-3 flex items-center h-5">
              <input
                onChange={(e) =>
                  selectAllBatches(e.target.checked, program.batches)
                }
                id={`demoProgram-${program.id}`}
                name={`demoProgram-${program.id}`}
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
          </div>
          {program.batches?.map((batch) => {
            const checked = selectedBatches.includes(batch.id);
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
                      onChange={(e) =>
                        selectBatches(e.target.checked, batch.id)
                      }
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

      {loading ? (
        <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
      ) : (
        <button
          onClick={onClick}
          className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
        >
          Re Register Batches
        </button>
      )}
    </div>
  );
};

export default ReRegisterBatch;
