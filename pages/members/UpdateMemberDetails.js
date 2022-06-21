import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";

const UpdateMemberDetails = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [birthDate, setBirthDate] = useState();
  const [healthIssues, setHealthIssues] = useState();

  useEffect(() => {
    setName(props.memberForAction.name);
    setPhone(props.memberForAction.mobile_number);
    setAddress(props.memberForAction.address);
    if (props.memberForAction.birthday) {
      setBirthDate(
        format(parseISO(props.memberForAction.birthday), "yyyy-MM-dd")
      );
    }
    setHealthIssues(props.memberForAction.health_issue);
  }, [props.memberForAction]);

  const updateDetails = () => {
    setApiLoading(true);

    if (!name || !phone) {
      setApiLoading(false);
      toast.error("Name or Phone cannot be empty");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      memberDetails: {
        name,
        mobile: phone,
        birthdate: birthDate,
        healthissues: healthIssues,
        address,
      },
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      `https://api.habuild.in/api/member/updateMemberDetails/${props.memberForAction.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (result.status == 500) {
          toast.error(JSON.stringify(result.message));
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

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      actionText="Update"
      onActionButtonClick={updateDetails}
      // hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">
            Update Member Details for -{" "}
          </h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                name="name"
                id="name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md "
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <div className="mt-1">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                name="phone"
                id="phone"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <div className="mt-1">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                name="address"
                id="address"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700"
            >
              Birth Date
            </label>
            <div className="mt-1">
              <input
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                type="date"
                name="birthDate"
                id="birthDate"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="healthIssues"
              className="block text-sm font-medium text-gray-700"
            >
              health Issues
            </label>
            <div className="mt-1">
              <textarea
                value={healthIssues}
                onChange={(e) => setHealthIssues(e.target.value)}
                rows={2}
                name="healthIssues"
                id="healthIssues"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMemberDetails;
