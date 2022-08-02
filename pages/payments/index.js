import { useEffect, useState, Fragment } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";
import Modal from "../../components/Modal";
import { RefreshIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { PaymentApis } from "../../constants/apis";
import AddCommModal from "../leads/AddCommModal";
import ViewMemberCommsModal from "../members/ViewMemberCommsModal";

const tabs = [
  { name: "Failed Payments", href: "#", current: false },
  { name: "Successfull Payments", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Payments = (props) => {
  const [currentPaymentsToShow, setCurrentPaymentsToShow] = useState([]);
  const [successfullPayments, setSuccessfullPayments] = useState([]);
  const [failedPayments, setFailedPayments] = useState([]);
  const [editPayment, setEditPayment] = useState([]);
  const [viewEditModal, setViewEditModal] = useState(false);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPagePagination, setCurrentPagePagination] = useState(1);
  const [currentTab, setCurrentTab] = useState("Failed Payments");
  const [apiLoading, setApiLoading] = useState(false);
  const [viewExistingModal, setViewExistingModal] = useState(false);
  const [paymentToShow, setPaymentToShow] = useState({});
  const [leadForAction, setLeadForAction] = useState({});
  const [viewAddCommModal, setViewAddCommModal] = useState(false);
  const [viewCommsModal, setViewCommsModal] = useState(false);

  useEffect(() => {
    getPayments(1);
  }, []);

  const getPayments = async (pageNum) => {
    setApiLoading(true);
    setCurrentPagePagination(pageNum);
    await fetch(PaymentApis.GET_PAYMENTS(pageNum))
      .then((res) => res.json())
      .then((data) => {
        console.log("Payments", data);

        let successfullPayments = [];
        let failedPayments = [];
        let allPayments = [];

        for (let i = 0; i < data.data.paymentDataArr.length; i++) {
          if (data.data.paymentDataArr[i].status == "SUCCESS") {
            const obj = {
              ...data.data.paymentDataArr[i],
              action: data.data.paymentDataArr[i],
            };
            successfullPayments.push(obj);
          } else {
            const obj = {
              ...data.data.paymentDataArr[i],
              action: data.data.paymentDataArr[i],
            };
            failedPayments.push(obj);
          }
        }

        console.log("Failed Payments!!!!!!!!!", failedPayments);

        setSuccessfullPayments(successfullPayments);
        setFailedPayments(failedPayments);
        if (currentTab == "Failed Payments") {
          setCurrentPaymentsToShow(failedPayments);
        } else {
          setCurrentPaymentsToShow(successfullPayments);
        }

        setTotalRecords(data.data.totalPaymentsSize);
        setApiLoading(false);
      });
  };

  const menuItems = [
    {
      name: "View Communication Logs",
      onClick: (actionEntity) => {
        setLeadForAction(actionEntity.habuild_members);
        setViewCommsModal(true);
      },
    },
    {
      name: "Add Communication Log",
      onClick: (actionEntity) => {
        setLeadForAction(actionEntity.habuild_members);
        setViewAddCommModal(true);
      },
    },
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
      render: (created_at) => {
        return (
          <div className="text-sm font-medium text-gray-700">
            {format(parseISO(created_at), "PPpp")}
          </div>
        );
      },
    },
    // {
    //   title: "Gateway",
    //   dataIndex: "gateway",
    //   key: "gateway",
    // },
    {
      title: "Member Id",
      dataIndex: "member_id",
      key: "member_id",
    },
    {
      title: "Name",
      dataIndex: "habuild_members",
      key: "habuild_members",
      render: (memberObj) => {
        return <div className="text-sm  text-gray-600">{memberObj.name}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "habuild_members",
      key: "habuild_members",
      render: (memberObj) => {
        return <div className="text-sm  text-gray-600">{memberObj.email}</div>;
      },
    },
    {
      title: "Mobile Number",
      dataIndex: "habuild_members",
      key: "habuild_members",
      render: (memberObj) => {
        return (
          <div className="text-sm  text-gray-600">
            {memberObj.mobile_number}
          </div>
        );
      },
    },
    // {
    //   title: "Mode",
    //   dataIndex: "mode",
    //   key: "mode",
    // },
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
    },
    // {
    //   title: "Pg Request",
    //   dataIndex: "pg_request",
    //   key: "pg_request",
    // },
    // {
    //   title: "Pg Response",
    //   dataIndex: "pg_response",
    //   key: "pg_response",
    // },
    // {
    //   title: "Source",
    //   dataIndex: "source",
    //   key: "source",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    currentTab == "Failed Payments" && {
      title: "Latest Status",
      dataIndex: "latestPayment",
      key: "latestPayment",
      render: (latestPaymentArr) => {
        console.log("Column Data", latestPaymentArr);

        if (latestPaymentArr?.length > 0) {
          return (
            <div className="flex flex-row">
              <ExternalLinkIcon
                className="mr-2 h-5 w-5 text-green-400 cursor-pointer hover:text-green-600"
                onClick={() => {
                  setViewExistingModal(true);
                  setPaymentToShow(latestPaymentArr[0]);
                }}
              />
              <span className="text-sm font-medium text-gray-700">
                {latestPaymentArr[0].status}
              </span>
            </div>
          );
        } else {
          return <div>-</div>;
        }
      },
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

  const handleTabChange = (newTab) => {
    if (newTab == "Failed Payments") {
      setCurrentPaymentsToShow(failedPayments);
    } else {
      setCurrentPaymentsToShow(successfullPayments);
    }
    setCurrentTab(newTab);
  };

  if (apiLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>

        <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>

      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                onClick={() => handleTabChange(tab.name)}
                key={tab.name}
                href={tab.href}
                className={`
                  ${
                    currentTab == tab.name
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* {currentPaymentsToShow.length > 0 ? ( */}
      <Table
        onPaginationApi={getPayments}
        pagination
        totalRecords={totalRecords}
        columns={columns}
        dataSource={currentPaymentsToShow}
        currentPagePagination={currentPagePagination}
      />
      {/* ) : (
        <h1 className="my-2 font-medium text-lg text-gray-700">
          No Payments to Show
        </h1>
      )} */}

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

      <ExistingPaymentModal
        paymentToShow={paymentToShow}
        viewModal={viewExistingModal}
        setViewModal={setViewExistingModal}
        columns={columns}
      />

      <AddCommModal
        leadForAction={leadForAction}
        modalOpen={viewAddCommModal}
        setModalOpen={setViewAddCommModal}
      />

      <ViewMemberCommsModal
        memberForAction={leadForAction}
        modalOpen={viewCommsModal}
        setModalOpen={setViewCommsModal}
      />
    </div>
  );
};

const ExistingPaymentModal = (props) => {
  return (
    <Modal
      modalOpen={props.viewModal}
      setModalOpen={props.setViewModal}
      hideActionButtons
    >
      <Table columns={props.columns} dataSource={[props.paymentToShow]} />
    </Modal>
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
    // {
    //   label: "PG Request",
    //   value: pg_request,
    //   type: "text",
    //   name: "pg_request",
    //   setterMethod: setPgRequest,
    // },
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
