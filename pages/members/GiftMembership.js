import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { MembersApis } from "../../constants/apis";

const GiftMembershipModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [numDays, setNumDays] = useState(0);

  const giftMembership = (member, calledFrom) => {
    setApiLoading(true);

    let memberForAction;

    if (member?.id) {
      memberForAction = member;
    } else {
      memberForAction = props.memberForAction;
    }

    if (!numDays) {
      setApiLoading(false);
      toast.error("Number of Days cannot be 0");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      email: memberForAction.email,
      noOfDays: numDays,
      batchId: memberForAction.preffered_batch_id,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(MembersApis.GIFT_MEMBERSHIP(), requestOptions)
      .then((response) => response.json())
      .then((result) => {
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
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        // console.log("error", error);
      });
  };

  const triggerGroupAction = () => {
    for (let i = 0; i < props.selectedMembers.length; i++) {
      giftMembership(props.selectedMembers[i], "groupActions");
    }

    props.setModalOpen(false);
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      actionText="Gift"
      onActionButtonClick={
        props.calledFrom == "groupActions" ? triggerGroupAction : giftMembership
      }
      // hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700">Gifting Membership to...</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>
        <label>No. of Days</label>
        <input
          onChange={(e) => setNumDays(e.target.value)}
          className="p-2 border border-gray-600 rounded-md ml-2"
          type={"number"}
        />
      </div>
    </Modal>
  );
};

export default GiftMembershipModal;
