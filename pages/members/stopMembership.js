import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const StopMembership = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [refundCheck, setRefundCheck] = useState(false);

  const giftMembership = () => {
    setApiLoading(true);

    if (refundCheck) {
      if (!utr || !amount) {
        setApiLoading(false);
        toast.error("Please provide UTR and Amount of transaction.");
        return;
      }
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      amount: amount,
      utr: utr,
      createRefundLog: refundCheck,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      `https://api.habuild.in/api/member/stop_membership/${props.memberForAction.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (result.status == 500) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
        }
        props.getPaginatedLeads(props.currentPagePagination);
        props.setModalOpen(false);
        setRefundCheck(false);
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        console.log("error", error);
      });
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      actionText="Stop/Refund membership"
      onActionButtonClick={giftMembership}
      // hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700">Stopping Membership for...</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props.memberForAction.name}
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
