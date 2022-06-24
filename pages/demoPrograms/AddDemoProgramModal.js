import { useEffect, useState, Fragment } from "react";

import Modal from "../../components/Modal";

import { RefreshIcon } from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import Select from "react-select";
import { DemoProgramsApis } from "../../constants/apis";

const AddDemoProgramModal = (props) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  const [associatedProgram, setAssociatedProgram] = useState({});

  const addDemoProgramFields = [
    {
      label: "Name",
      value: name,
      type: "text",
      name: "name",
      setterMethod: setName,
    },
    {
      label: "Meeting Id",
      value: meetingId,
      type: "text",
      name: "meetingId",
      setterMethod: setMeetingId,
    },
    {
      label: "Start Date",
      value: startDate,
      type: "date",
      name: "startDate",
      setterMethod: setStartDate,
    },
    {
      label: "End Date",
      value: endDate,
      type: "date",
      name: "endDate",
      setterMethod: setEndDate,
    },
    {
      label: "Associated Program",
      value: associatedProgram,
      type: "select",
      name: "programId",
      setterMethod: setAssociatedProgram,
      options: props.programs?.map((item) => {
        return {
          value: item.id,
          label: item.title,
          obj: item,
        };
      }),
    },
  ];

  const formSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!name || !startDate || !endDate || !associatedProgram) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      name,
      startDate,
      endDate,
      meetingId,
      programId: associatedProgram,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(DemoProgramsApis.CREATE(), requestOptions)
      .then((response) => {
        // console.log("Repsobnse", response);
        return response.text();
      })
      .then((result) => {
        setApiLoading(false);
        toast.success("Demo Program Created");
        props.getAllDemoPrograms();
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        toast.error("No lead created");
        // console.log("error", error);
      });
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.viewAddModal || false}
      setModalOpen={props.setViewAddModal}
      actionText="Add Demo Program"
      hideActionButtons
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add Demo Program
        </h2>

        {addDemoProgramFields?.map((item) => {
          if (item.type == "select") {
            return (
              <div key={item.label}>
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <Select
                  isDisabled={apiLoading}
                  placeholder={item.placeholder}
                  onChange={(option) => {
                    item.setterMethod(option.value);
                  }}
                  options={item.options}
                ></Select>
              </div>
            );
          }

          return (
            <div key={item.label}>
              <label className="block text-sm font-medium text-gray-700">
                {item.label}
              </label>
              <input
                value={item.value}
                onChange={(e) => item.setterMethod(e.target.value)}
                type={item.type}
                name={item.name}
                id={item.name}
                placeholder={item.label}
                className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          );
        })}

        <button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          type="submit"
        >
          Add Demo Program
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddDemoProgramModal;
