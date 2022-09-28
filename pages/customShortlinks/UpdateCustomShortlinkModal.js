import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { DownloadIcon, RefreshIcon } from "@heroicons/react/outline";
import { ShortenerApis } from "../../constants/apis";
import toast from "react-hot-toast";

const UpdateCustomShortlinkModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [newShortRoute, setNewShortRoute] = useState(
    props.customShortlinkToUpdate.short_route
  );
  const [newLongUrl, setNewLongUrl] = useState(
    props.customShortlinkToUpdate.long_url
  );

  useEffect(() => {
    setNewShortRoute(props.customShortlinkToUpdate.short_route);
    setNewLongUrl(props.customShortlinkToUpdate.long_url);
  }, [props.customShortlinkToUpdate]);

  const formFields = [
    {
      label: "New Short Route",
      value: newShortRoute,
      type: "text",
      name: "newShortRoute",
      setterMethod: setNewShortRoute,
    },
    {
      label: "New Long Url",
      value: newLongUrl,
      type: "text",
      name: "newLongUrl",
      setterMethod: setNewLongUrl,
    },
  ];

  const updateShortLink = async () => {
    setApiLoading(true);

    if (!newLongUrl || !newShortRoute) {
      toast.error("New Long URL or New Short Route Missing");
      return;
    }

    const result = await props.customFetch(
      ShortenerApis.UPDATE_CUSTOM_SHORT_LINKS(),
      "PATCH",
      {
        shortRoute: newShortRoute,
        newLongUrl: newLongUrl,
        shortRouteId: props.customShortlinkToUpdate.id,
      }
    );

    setApiLoading(false);
    props.refetchData();
    props.setViewModal(false);
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.viewModal}
      setModalOpen={props.setViewModal}
      actionText="Update"
      onActionButtonClick={updateShortLink}
    >
      <h2 className="text-left text-xl font-bold text-gray-900">
        Update Custom ShortLink for
      </h2>

      {apiLoading ? <RefreshIcon className="w-6 h-6 animate-spin" /> : null}

      <div className="flex flex-col space-y-2 text-lg my-8">
        <span>{props.customShortlinkToUpdate.short_route}</span>
        <span>{props.customShortlinkToUpdate.long_url}</span>
      </div>

      {formFields.map((item) => {
        return (
          <div key={item.label} className="col-span-6 sm:col-span-3 mt-3">
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
    </Modal>
  );
};

export default UpdateCustomShortlinkModal;
