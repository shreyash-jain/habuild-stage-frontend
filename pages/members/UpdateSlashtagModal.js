import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import { MembersApis } from "../../constants/apis";

const UpdateSlashtagModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [slashtag, setSlashtag] = useState("");

  useEffect(() => {
    setSlashtag(props.memberForAction?.short_meeting_link?.split("/")[1]);
  }, [props.memberForAction]);

  const updateSlashtag = async () => {
    setApiLoading(true);

    if (!slashtag) {
      toast.error("Slashtag cannot be empty");
      return;
    }

    const result = await props.customFetch(
      MembersApis.UPDATE_SHORT_ROUTE(props.memberForAction.id),
      "POST",
      { shortRoute: slashtag }
    );

    if (result.ok) {
      toast.success(`Updated Slash Tag for ${props?.memberForAction?.name}`);
      if (props.searchFor && props.searchTerm) {
        props.refetchData();
      } else {
        props.getPaginatedLeads(props.currentPagePagination);
      }
      props.setModalOpen(false);
      setApiLoading(false);
    } else {
      toast.error(result.error);
      setApiLoading(false);
    }
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      onActionButtonClick={updateSlashtag}
      actionText="Update Short Route"
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">Update Slash Tag for -</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="shortRoute"
              className="block text-sm font-medium text-gray-700"
            >
              Short Route
            </label>
            <div className="mt-1">
              <input
                disabled={apiLoading}
                id="shortRoute"
                name="shortRoute"
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md "
                value={slashtag}
                onChange={(e) => setSlashtag(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateSlashtagModal;
