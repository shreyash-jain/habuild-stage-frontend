import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { MembersApis } from "../../constants/apis";
import { format } from "date-fns";

const PauseMembership = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [numDays, setNumDays] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState(false);

  const pauseMembership = async (member, calledFrom) => {
    setApiLoading(true);

    if (!numDays || !pauseStartDate) {
      setApiLoading(false);
      toast.error("Number of Days or pause start date missing.");
      return;
    }

    let memberForAction;

    if (member.id) {
      memberForAction = member;
    } else {
      memberForAction = props.memberForAction;
    }

    try {
      const result = await props.customFetch(
        MembersApis.PAUSE_MEMBERSHIP({
          numDays,
          memberId: memberForAction.id,
          pauseStartDate,
        }),
        "PATCH",
        {}
      );

      // console.log(result);
      setApiLoading(false);
      if (result.status == 500) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
      if (calledFrom !== "groupActions") {
        props.getPaginatedLeads(props.currentPagePagination);
        props.setModalOpen(false);
      }
      // console.log(result);
    } catch (error) {
      setApiLoading(false);
      // toast.error(error);
      // console.log("error", error);
    }
  };

  const triggerGroupAction = () => {
    for (let i = 0; i < props.selectedMembers.length; i++) {
      pauseMembership(props.selectedMembers[i], "groupActions");
    }

    props.setModalOpen(false);
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      actionText="Pause membership"
      onActionButtonClick={
        props.calledFrom == "groupActions"
          ? triggerGroupAction
          : pauseMembership
      }
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
          className="p-2 font-medium text-gray-800 rounded-md border border-gray-500 max-w-fit"
          type={"date"}
          onChange={(e) => setPauseStartDate(e.target.value)}
          defaultValue={format(new Date(), "yyyy-MM-dd")}
        />

        <label className="mt-4 text-lg">Number of Pause days</label>
        <input
          defaultValue={100}
          className="p-2 font-medium text-gray-800 rounded-md border border-gray-500 max-w-fit"
          type={"number"}
          onChange={(e) => setNumDays(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default PauseMembership;
