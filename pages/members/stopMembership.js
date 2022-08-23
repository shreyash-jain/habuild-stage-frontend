import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { MembersApis } from "../../constants/apis";

const StopMembership = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [refundCheck, setRefundCheck] = useState(false);

  const stopMembership = async (member, calledFrom) => {
    setApiLoading(true);

    if (refundCheck) {
      if (!utr || !amount) {
        setApiLoading(false);
        toast.error("Please provide UTR and Amount of transaction.");
        return;
      }
    }

    let memberForAction;

    if (member?.id) {
      memberForAction = member;
    } else {
      memberForAction = props.memberForAction;
    }

    var raw = {
      amount: amount,
      utr: utr,
      createRefundLog: refundCheck,
    };

    try {
      const result = props.customFetch(
        MembersApis.STOP_MEMBERSHIP(memberForAction.id),
        "PATCH",
        raw
      );

      setApiLoading(false);
      if (result.status == 500) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
      props.getPaginatedLeads(props.currentPagePagination);
      props.setModalOpen(false);

      setRefundCheck(false);
    } catch (error) {
      setApiLoading(false);
      // toast.error(error);
      // console.log("error", error);
    }
  };

  const triggerGroupAction = () => {
    for (let i = 0; i < props.selectedMembers.length; i++) {
      stopMembership(props.selectedMembers[i], "groupActions");
    }

    props.setModalOpen(false);
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      actionText="Stop/Refund membership"
      onActionButtonClick={
        props.calledFrom == "groupActions" ? triggerGroupAction : stopMembership
      }
      // hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700">Stopping Membership for...</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>

        <label>Amount Refunded?</label>
        <input
          className="ml-2"
          type="checkbox"
          onChange={(e) => setRefundCheck(e.target.checked)}
        />

        {refundCheck && (
          <div className="space-x-2">
            <input
              placeholder="Transaction UTR"
              className="p-2 rounded-md text-gray-800 font-medium border border-gray-500"
              type="text"
              onChange={(e) => setUtr(e.target.value)}
            />
            <input
              placeholder="Amount"
              className="p-2 rounded-md text-gray-800 font-medium border border-gray-500"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StopMembership;
