import { useEffect, useState, Fragment } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Select from "react-select";
import { SchedulerApis, WatiTemplatesApis } from "../../constants/apis";
import SidePannel from "../../components/SidePannel";

const ChangeTemplateSidePanel = (props) => {
  const [watiTemplates, setWatiTemplates] = useState([]);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async (calledFrom) => {
    const data = await props.customFetch(WatiTemplatesApis.GET(), "GET", {});
    setWatiTemplates(data.data);
    if (calledFrom == "fromRefetch") {
      setRefetchLoading(false);
      toast.success("Wat templates updated.");
    }
  };

  const refetchTemplates = async () => {
    setRefetchLoading(true);
    await props.customFetch(WatiTemplatesApis.REFETCH(), "PATCH", {});
    fetchTemplates("fromRefetch");
  };

  const changeTemplate = async () => {
    setUpdateLoading(true);

    if (!window.confirm("Are you sure?")) {
      setUpdateLoading(false);
      return;
    }

    const result = await props.customFetch(
      SchedulerApis.UPDATE_USED_WATI_TEMPLATE(),
      "POST",
      {
        id: props?.templateToUpdate?.id,
        newTemplateId: selectedTemplate.id,
      }
    );

    console.log("wati temp change result", result);

    if (result.ok) {
      props.setOpen(false);
      props.refetchData();
      toast.success("Successfully changed wati template");
    } else {
      toast.error("Failed to change wati template");
    }
    setUpdateLoading(false);
  };

  return (
    <SidePannel
      width="max-w-2xl"
      title={`Change Template for ${props.schedulerToUpdate?.scheduler_name}`}
      isOpen={props.open || false}
      setIsOpen={props.setOpen}
    >
      <div className="bg-white overflow-hidden shadow rounded-lg mt-4">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-xl font-normal text-gray-700">
              Select wati template to replace{" "}
              <span className="font-bold">
                {props.templateToUpdate?.template?.identifier}
              </span>
            </h1>

            <div className="w-full">
              <Select
                onChange={(option) => {
                  setSelectedTemplate(option.obj);
                  setMessage(option.obj.body);
                }}
                options={watiTemplates?.map((item) => {
                  return {
                    value: item.id,
                    label: item.identifier,
                    obj: item,
                  };
                })}
              ></Select>

              {refetchLoading ? (
                <RefreshIcon className="text-green-300 animate-spin h-6 w-6 mx-auto" />
              ) : (
                <button
                  className="px-4 py-2 font-medium rounded-md bg-white mt-2 text-green-500 hover:bg-green-500 hover:text-white"
                  onClick={refetchTemplates}
                >
                  Refetch Templates
                </button>
              )}
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

            {updateLoading ? (
              <RefreshIcon className="text-green-300 animate-spin h-6 w-6 mx-auto" />
            ) : (
              <button
                className="px-4 py-2 font-medium rounded-md bg-white mt-2 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={changeTemplate}
              >
                Change Template
              </button>
            )}
          </div>
        </div>
      </div>
    </SidePannel>
  );
};

export default ChangeTemplateSidePanel;
