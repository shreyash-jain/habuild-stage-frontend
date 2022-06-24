import { useEffect, useState, Fragment } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import LayoutSidebar from "../components/LayoutSidebar";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";
import Modal from "../components/Modal";
import {
  RefreshIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { PaymentApis } from "../constants/apis";

const Payments = (props) => {
  const [payments, setPayments] = useState([]);
  const [editPayment, setEditPayment] = useState([]);
  const [viewEditModal, setViewEditModal] = useState(false);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPagePagination, setCurrentPagePagination] = useState(1);

  useEffect(() => {
    getPayments(1);
  }, []);

  const getPayments = async (pageNum) => {
    setCurrentPagePagination(pageNum);
    await fetch(PaymentApis.GET_PAYMENTS(pageNum))
      .then((res) => res.json())
      .then((data) => {
        // console.log("Payments", data);
        setPayments(
          data.data.paymentDataArr.map((item) => {
            return {
              ...item,
              action: item,
            };
          })
        );
        setTotalRecords(data.data.totalPaymentsSize);
      });
  };

  const menuItems = [
    // {
    //   name: "Edit",
    //   onClick: (actionEntity) => {
    //     setEditPayment(actionEntity);
    //     setViewEditModal(true);
    //   },
    // },
    // {
    //   name: "Delete",
    //   onClick: (actionEntity) => {
    //     if (window.confirm("Are you sure you want to Delete this quote?")) {
    //       deleteAttendanceQuote(actionEntity.id);
    //     }
    //   },
    // },
    // {
    //   name: "View Attendance",
    //   onClick: () => {
    //     setViewAttendanceModal(!viewAttendanceModal);
    //   },
    // },
  ];

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Gateway",
      dataIndex: "gateway",
      key: "gateway",
    },
    {
      title: "Member Id",
      dataIndex: "member_id",
      key: "member_id",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Pg Request",
      dataIndex: "pg_request",
      key: "pg_request",
    },
    {
      title: "Pg Response",
      dataIndex: "pg_response",
      key: "pg_response",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
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
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (actionEntity) => {
        return (
          <FlyoutMenu
            actionEntity={actionEntity}
            menuItems={menuItems}
          ></FlyoutMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>

      <Table
        onPaginationApi={getPayments}
        pagination
        totalRecords={totalRecords}
        columns={columns}
        dataSource={payments}
        currentPagePagination={currentPagePagination}
      />

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Payment +
      </button>

      <PaymentFormModal
        getPayments={getPayments}
        viewModal={viewAddModal}
        setViewModal={setViewAddModal}
      />

      {/* <PaymentFormModal
        editPayment={editPayment}
        getPayments={getPayments}
        viewModal={viewEditModal}
        setViewModal={setViewEditModal}
        mode="edit"
      /> */}
    </div>
  );
};

const PaymentFormModal = (props) => {
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState("");
  const [member_id, setMemberId] = useState("");
  const [mode, setMode] = useState("");
  const [order_id, setOrderId] = useState("");
  const [pg_request, setPgRequest] = useState("");
  const [pg_response, setPgResponse] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [utr, setUtr] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  // useEffect(() => {
  //   if (props.mode == "edit") {
  //     setAmount(props.editQuote.date?.split("T")[0]);
  //     setGateway(props.editQuote.demo_batch_id);
  //     setMemberId(props.editQuote.highlight);
  //     setMode(props.editQuote.quote_1);
  //     setOrderId(props.editQuote.highlight_2);
  //     setPgRequest(props.editQuote.program_id);
  //     setPgResponse(props.editQuote.quote_2);
  //     setSource(props.editQuote.quote_3);
  //     setStatus(props.editQuote.status);
  //     setUtr(props.editQuote.tip);
  //   }
  // }, [props.viewModal]);

  const paymentFormFields = [
    {
      label: "Amount",
      value: amount,
      type: "number",
      name: "amount",
      setterMethod: setAmount,
    },
    {
      label: "Gateway",
      value: gateway,
      type: "text",
      name: "gateway",
      setterMethod: setGateway,
    },
    {
      label: "Member Id",
      value: member_id,
      type: "number",
      name: "member_id",
      setterMethod: setMemberId,
    },
    {
      label: "Mode",
      value: mode,
      type: "text",
      name: "mode",
      setterMethod: setMode,
    },
    {
      label: "Order Id",
      value: order_id,
      type: "text",
      name: "order_id",
      setterMethod: setOrderId,
    },
    {
      label: "PG Request",
      value: pg_request,
      type: "text",
      name: "pg_request",
      setterMethod: setPgRequest,
    },
    {
      label: "PG Response",
      value: pg_response,
      type: "text",
      name: "pg_response",
      setterMethod: setPgResponse,
    },
    {
      label: "Source",
      value: source,
      type: "text",
      name: "source",
      setterMethod: setSource,
    },
    {
      label: "Status",
      value: status,
      type: "text",
      name: "status",
      setterMethod: setStatus,
    },
    {
      label: "UTR",
      value: utr,
      type: "text",
      name: "utr",
      setterMethod: setUtr,
    },
  ];

  const formSubmit = (e) => {
    let API = PaymentApis.CREATE();
    let method = "POST";

    e.preventDefault();
    setApiLoading(true);
    if (
      !amount ||
      !gateway ||
      !member_id ||
      !mode ||
      !order_id ||
      !pg_request ||
      !pg_response ||
      !status ||
      !source ||
      !utr
    ) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      amount,
      gateway,
      member_id,
      mode,
      order_id,
      pg_request,
      pg_response,
      source,
      status,
      utr,
    });
    var requestOptions = {
      method: method,
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // console.log(raw);
    // console.log(API);
    // console.log(method);

    try {
      fetch(API, requestOptions)
        .then((response) => {
          // console.log("response", response);
          return response.text();
        })
        .then((result) => {
          setApiLoading(false);
          toast.success(
            `Payment ${props.mode == "edit" ? "Updated" : "Created"}`
          );
          props.getPayments();
          props.setViewModal(false);
          // console.log("Api Result", result);
        });
    } catch {
      (error) => {
        setApiLoading(false);
        toast.error(
          `No payment ${props.mode == "edit" ? "Updated" : "Created"}`
        );
        // console.log("error", error);
      };
    }
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.viewModal}
      setModalOpen={props.setViewModal}
      hideActionButtons
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          {props.mode == "edit" ? "Edit" : "Add"} Payment Log
        </h2>

        {paymentFormFields.map((item) => {
          return (
            <div key={item.label} className="col-span-6 sm:col-span-3">
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

        <button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          type="submit"
        >
          {props.mode == "edit" ? "Edit" : "Add"} Payment Log
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

Payments.getLayout = LayoutSidebar;

export default Payments;
