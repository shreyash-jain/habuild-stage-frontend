import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { MembersApis, PaymentApis } from "../../constants/apis";
import Table from "../../components/Table";
import { format, isFuture, isSunday, parseISO } from "date-fns";
import { RefreshIcon } from "@heroicons/react/outline";

const StopMembership = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [refundCheck, setRefundCheck] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentForAction, setPaymentForAction] = useState({});

  useEffect(async () => {
    setUtr("");
    setAmount("");
    setPaymentForAction({});

    if (props.calledFrom !== "groupActions") {
      if (props.memberForAction.id) {
        getPaymentHistory();
      }
    }
  }, [props.memberForAction]);

  const getPaymentHistory = async () => {
    console.log("IN MEtthod!!!!!!!!!");
    setApiLoading(true);

    const result = await props.customFetch(
      PaymentApis.GET_USER_PAYMENT_HISTORY(props.memberForAction.id),
      "GET",
      {}
    );

    console.log(result);

    if (result.status == 200) {
      const payments = result.result.map((item) => {
        return {
          ...item,
          action: item,
        };
      });
      setPayments(payments);
    } else {
    }

    setApiLoading(false);
  };

  const stopMembership = async (member, calledFrom) => {
    if (!member?.id) {
      if (!window.confirm("Are you sure?")) {
        return;
      }
    }

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
      paymentId: paymentForAction?.id,
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
      // props.setModalOpen(false);

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

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Subscription Info",
      dataIndex: "habuild_member_batches",
      key: "habuild_member_batches",
      render: (batches) => {
        if (batches[0]?.sub_start_date) {
          return (
            <>
              <span className="font-medium">
                {format(parseISO(batches[0]?.sub_start_date), "PP")}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {format(parseISO(batches[0]?.sub_end_date), "PP")}{" "}
              </span>
            </>
          );
        }
      },
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => {
        return (
          <div className="text-sm font-medium text-gray-700">
            {format(parseISO(created_at), "PPpp")}
          </div>
        );
      },
    },
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "UTR",
      dataIndex: "utr",
      key: "utr",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (obj) => {
        if (obj.status == "SUCCESS") {
          return (
            <button
              onClick={() => {
                setUtr(obj.utr);
                setAmount(obj.amount);
                setPaymentForAction(obj);
              }}
              className="font-medium text-white bg-green-400 hover:bg-green-600 rounded-md px-4 py-2"
            >
              Refund
            </button>
          );
        }
      },
    },
  ];

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
        {/* 
        <label>Amount Refunded?</label>
        <input
          className="ml-2"
          type="checkbox"
          onChange={(e) => setRefundCheck(e.target.checked)}
        /> */}

        {props.calledFrom !== "groupActions" && (
          <div className="h-96 overflow-y-scroll">
            {apiLoading ? (
              <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
            ) : (
              <Table columns={columns} dataSource={payments} />
            )}
          </div>
        )}

        <div className="space-x-2">
          <input
            value={utr}
            placeholder="Transaction UTR"
            className="p-2 rounded-md text-gray-800 font-medium border border-gray-500"
            type="text"
            onChange={(e) => setUtr(e.target.value)}
          />
          <input
            value={amount}
            placeholder="Amount"
            className="p-2 rounded-md text-gray-800 font-medium border border-gray-500"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default StopMembership;
