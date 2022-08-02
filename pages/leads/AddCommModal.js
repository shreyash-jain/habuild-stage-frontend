import { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { LeadsApis } from "../../constants/apis";

const AddCommModal = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("Phone");
  const [apiLoading, setApiLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!props.leadForAction) {
      toast.error("Error!");
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      member_id: props.leadForAction.member_id || props.leadForAction.id,
      date: new Date(),
      status: "success",
      type: "lead_query",
      mode,
      name,
      description,
      source: "crm",
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // console.log(requestOptions);
    fetch(LeadsApis.CREATE_COMM(), requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setApiLoading(false);
        setName("");
        setDescription("");
        setMode("Phone");
        props.setModalOpen(false);
        toast.success("Communication Log Created");
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        // console.log("error", error);
      });
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      actionText="Add"
      hideActionButtons
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add Communication Details
        </h2>

        <form
          className="flex flex-col w-full space-y-5"
          onSubmit={(e) => {
            formSubmit(e);
          }}
        >
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Agent Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              placeholder="Name"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="mode"
              className="block text-md font-medium text-gray-700"
            >
              Mode
            </label>

            <select
              name="mode"
              onChange={(e) => setMode(e.target.value)}
              className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
            >
              <option value="phone">Phone</option>
              <option value="wa">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Comm Summary
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              rows={5}
              name="description"
              id="description"
              placeholder="Communication Summary"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <button
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
            type="submit"
          >
            Add Comm
            {apiLoading && (
              <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCommModal;
