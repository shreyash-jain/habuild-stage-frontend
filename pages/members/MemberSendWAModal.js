import { useEffect, useState, Fragment } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Select from "react-select";
import { NotificationApis } from "../../constants/apis";

const SendWAModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [message, setMessage] = useState("");

  const [sendMessageToAll, setSendMessageToAll] = useState(false);

  useEffect(() => {
    setMessage("");
  }, [props.open]);

  const sendMessageApi = (mode, selectedDemoBatches) => {
    setApiLoading(true);
    let vars = {};
    let api = "";

    if (!selectedTemplate) {
      toast.error("Template message not selected.");
      return;
    }

    if (mode !== "all") {
      if (props.selectedLeadsLength == 0) {
        toast.error("No person Selected.");
        props.setOpen(false);
        return;
      }
    }

    if (mode == "all") {
      vars = {
        batch_ids: selectedDemoBatches,
        // batch_ids: ["2", "3", "4"],
        // batch_ids: ["4"],
        template_name: selectedTemplate.identifier,
      };
      api = NotificationApis.MEMBERS_SEND_TO_BATCH();
    } else {
      const member_ids = props.selectedLeads?.map((item) => {
        return item.member_id;
      });
      vars = {
        member_ids,
        template_name: selectedTemplate.identifier,
      };
      api = NotificationApis.SEND_TO_MEMBERS();
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(vars);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // console.log("Vars", vars);

    // console.log(api);
    // console.log(vars);

    fetch(api, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        toast.success("Message sent successfully!");
        // if (result.errorMessage) {
        //   toast.error(result.errorMessage);
        // } else {
        //   toast.success(result.message);
        // }
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
    // <Modal
    //   modalOpen={props.viewSendWAModal}
    //   setModalOpen={props.setViewSendWAModal}
    //   actionText="Send"
    // >
    <div className="bg-white overflow-hidden shadow rounded-lg mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="font-medium">
            {props.selectedLeadsLength} people selected
          </div>

          <h1 className="text-xl font-bold text-gray-700">
            Select Wati Template
          </h1>

          <div className="w-full">
            <Select
              onChange={(option) => {
                setSelectedTemplate(option.obj);
                setMessage(option.obj.body);
              }}
              options={props.watiTemplates?.map((item) => {
                return {
                  value: item.id,
                  label: item.identifier,
                  obj: item,
                };
              })}
            ></Select>

            {props.refetchLoading ? (
              <RefreshIcon className="text-green-300 animate-spin h-6 w-6 mx-auto" />
            ) : (
              <button
                className="px-4 py-2 font-medium rounded-md bg-white mt-2 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={props.refetchTemplates}
              >
                Refetch Templates
              </button>
            )}

            {/* <FancySelect
                parentOnchange={templateChange}
                templateOptions={props.watiTemplates}
              ></FancySelect> */}
          </div>

          <div>
            <label
              htmlFor="first-name"
              className="block text-md font-medium text-gray-500"
            >
              Message
            </label>
            <textarea
              disabled
              value={message}
              rows={20}
              name="message"
              id="message"
              autoComplete="message"
              className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
            />
          </div>

          {apiLoading ? (
            <RefreshIcon className="text-green-300 animate-spin h-6 w-6 mx-auto" />
          ) : (
            <>
              <button
                onClick={() => {
                  if (!apiLoading) {
                    sendMessageApi();
                  }
                }}
                className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
              >
                Send Message to Selected People
              </button>

              <SendMessageToAllLeads
                apiLoading={apiLoading}
                sendMessageApi={sendMessageApi}
                memberProgramsWithBatches={props.memberProgramsWithBatches}
              />

              {/* <button
                onClick={() => {
                  if (!apiLoading) {
                    setSendMessageToAll(true);
                    //   if (window.confirm("Are you sure you want to do this?")) {
                    //     sendMessageApi("all");
                    //   }
                  }
                }}
                className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
              >
                Send Message to All Leads
              </button> */}
            </>
          )}
        </div>
      </div>
    </div>
    // </Modal>
  );
};

const SendMessageToAllLeads = (props) => {
  const [selectedDemoBatches, setSelectedDemobatches] = useState([]);

  const selectBatches = (checked, id) => {
    // console.log("OnChange Called");
    const newBatchIds = [...selectedDemoBatches];

    if (checked) {
      newBatchIds.push(id);
    } else {
      const indexToRemove = newBatchIds.indexOf(id);
      newBatchIds.splice(indexToRemove, 1);
    }

    setSelectedDemobatches(newBatchIds);
  };

  const selectAllBatches = (checked, demoBatches) => {
    const newBatchIds = [...selectedDemoBatches];

    if (checked) {
      for (let i = 0; i < demoBatches.length; i++) {
        newBatchIds.push(demoBatches[i].id);
      }
    } else {
      newBatchIds = [];
    }

    setSelectedDemobatches(newBatchIds);
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
            const checked = selectedDemoBatches.includes(batch.id);
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

      <button
        onClick={() => {
          if (!props.apiLoading) {
            if (window.confirm("Are you sure you want to do this?")) {
              props.sendMessageApi("all", selectedDemoBatches);
            }
          }
        }}
        className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
      >
        Send Message to All Members
      </button>
    </div>
  );
};

export default SendWAModal;
