import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const PauseMembership = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [numDays, setNumDays] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState(false);

  const pauseMembership = () => {
    setApiLoading(true);

    if (!numDays || !pauseStartDate) {
      setApiLoading(false);
      toast.error("Number of Days or pause start date missing.");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: "",
      redirect: "follow",
    };
    fetch(
      `https://api.habuild.in/api/member/pause_membership?noOfDaysAsked=${numDays}&memberId=${props.memberForAction.id}&startDate=${pauseStartDate}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setApiLoading(false);
        if (result.status == 500) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
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
      actionText="Pause membership"
      onActionButtonClick={pauseMembership}
      // hideActionButtons
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-600">Pause Membership for...</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>

        <label className="text-lg">Start Date</label>
        <input
          className="p-2 font-medium text-gray-800 rounded-md border border-gray-500"
          type={"date"}
          onChange={(e) => setPauseStartDate(e.target.value)}
        />

        <label className="mt-4 text-lg">Number of Pause days</label>
        <input
          className="p-2 font-medium text-gray-800 rounded-md border border-gray-500"
          type={"number"}
          onChange={(e) => setNumDays(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default PauseMembership;
