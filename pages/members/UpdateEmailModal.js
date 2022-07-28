import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { MembersApis } from "../../constants/apis";
import { RefreshIcon } from "@heroicons/react/outline";

const UpdateEmailModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [email, setEmail] = useState();

  useEffect(() => {
    setEmail(props.memberForAction.email);
  }, [props.memberForAction]);

  const updateDetails = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!email) {
      setApiLoading(false);
      toast.error("Email cannot be empty");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      email,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(MembersApis.UPDATE_EMAIL(props.memberForAction.id), requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (!result.ok) {
          toast.error(JSON.stringify(result.error));
        } else {
          toast.success("Member Updated Successfully.");
        }
        props.getPaginatedLeads(props.currentPagePagination);
        props.setModalOpen(false);
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        // console.log("error", error);
      });
  };

  if (apiLoading) {
    return (
      <Modal
        apiLoading={apiLoading}
        modalOpen={props.modalOpen || false}
        setModalOpen={props.setModalOpen}
        hideActionButtons
      >
        <div className="space-y-4">
          <div className="flex flex-row">
            <h2 className="text-xl text-gray-700 mr-2">Update Email for -</h2>
            <h1 className="font-bold text-xl text-gray-800">
              {props?.memberForAction?.name}
            </h1>
          </div>

          <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">Update Email for -</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>

        <form onSubmit={(e) => updateDetails(e)}>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md "
                />
              </div>
            </div>
          </div>

          <button
            disabled={apiLoading}
            type="submit"
            className="max-w-fit inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          >
            Update Email
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateEmailModal;
