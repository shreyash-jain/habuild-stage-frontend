import { useEffect, useState, Fragment } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Select from "react-select";
import { WatiTemplatesApis } from "../../constants/apis";
import SidePannel from "../../components/SidePannel";

const ChangeTemplateSidePanel = (props) => {
  const [watiTemplates, setWatiTemplates] = useState([]);
  const [refetchLoading, setRefetchLoading] = useState(false);
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

  return (
    <SidePannel
      width="max-w-2xl"
      title="Change Template"
      isOpen={props.open || false}
      setIsOpen={props.setOpen}
    >
      <div className="bg-white overflow-hidden shadow rounded-lg mt-4">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-xl font-bold text-gray-700">
              Select Wati Template
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

              {props.refetchLoading ? (
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
          </div>
        </div>
      </div>
    </SidePannel>
  );
};

export default ChangeTemplateSidePanel;
