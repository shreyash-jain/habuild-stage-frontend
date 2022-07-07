import { useState, useEffect } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import Modal from "../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";

import { format, parseISO } from "date-fns";
import Select from "react-select";
import {
  ProgramsApis,
  BatchesApis,
  PaymentApis,
  MembersApis,
} from "../constants/apis";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PaymentApproval = () => {
  const [paymentsToApprove, setPaymentsToApprove] = useState([]);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [imageToShow, setImageToShow] = useState("");

  const [paymentToDecide, setPaymentToDecide] = useState({});
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [utr, setUtr] = useState("");

  const [memberProgramsWithBatches, setMemberProgramsWithBatches] = useState(
    []
  );

  const [viewAddModal, setViewAddModal] = useState(false);

  useEffect(() => {
    getAllPaymentsToApprove();
    getMemberProgramsWithBatches();
  }, []);

  const getMemberProgramsWithBatches = async () => {
    fetch(ProgramsApis.GET_PROGRAMS())
      .then((res) => {
        return res.json();
      })
      .then(async (data) => {
        // console.log("Program Data", data);

        const newArr = [];

        for (let i = 0; i < data.programs.length; i++) {
          await fetch(BatchesApis.GET_BATCH_FROM_PROGRAM(data.programs[i].id))
            .then((res) => {
              return res.json();
            })
            .then((data1) => {
              const obj = {
                ...data.programs[i],
                batches: data1.batch,
              };
              newArr.push(obj);

              // console.log("NEw Arr Programs with Batches", newArr);
            });
        }
        setMemberProgramsWithBatches(newArr);
      });
  };

  const getAllPaymentsToApprove = async () => {
    setLoading(true);
    await fetch(PaymentApis.GET_OFFLINE_PAYMENTS())
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const data1 = data.payment_logs.map((item) => {
          return {
            ...item,
            mobile_number: item.habuild_members.mobile_number,
            email: item.habuild_members.email,
            action: item,
          };
        });

        setPaymentsToApprove(data1);
        setLoading(false);
      });
  };

  // const beforeOpenActionPanel = (actionEntity) => {
  //   const demo_batches = getDemoBatches(actionEntity);

  //   // const demo_batches = demoBatches?.filter((item) => {
  //   //   if (actionEntity.id == item.demo_program_id) {
  //   //     return item;
  //   //   }
  //   // });

  //   const newObj = { ...actionEntity, demo_batches };

  //   setDemoProgramForAction(newObj);
  //   setShowActionsPanel(true);
  //   setInitialTab("View/Manage Batches");
  // };

  const columns = [
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Payment Screenshot",
      dataIndex: "screenshot",
      key: "screenshot",
      render: (link) => {
        return (
          <>
            <img
              // onClick={() => {
              //   setImageToShow(link);
              //   setShowScreenshotModal(true);
              // }}
              src={link}
              alt=""
              // className="w-20 rounded-md hover:cursor-pointer hover:opacity-75"
              className="w-20 rounded-md"
            />
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Payment App",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Plan",
      dataIndex: "Plan",
      key: "Plan",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (actionEntity) => {
        if (deleteLoading) {
          return (
            <RefreshIcon className="text-green animate-spin h-6 w-6 mx-auto" />
          );
        }
        return (
          <div className="flex flex-row space-x-2">
            <button
              onClick={() => {
                setImageToShow(actionEntity.screenshot);
                setPaymentToDecide(actionEntity);
                setShowScreenshotModal(true);
              }}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-grey-800 hover:text-white bg-green-400 hover:bg-green-600 focus:outline-none "
            >
              Approve
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-grey-800 hover:text-white bg-red-400 hover:bg-red-600 focus:outline-none "
            >
              Deny
            </button>
          </div>
        );
      },
    },
  ];

  // console.log("member Batches ", memberProgramsWithBatches);

  const computeSelectOptions = () => {
    const overallArr = [];

    for (let i = 0; i < memberProgramsWithBatches.length; i++) {
      memberProgramsWithBatches[i].batches.map((item1) => {
        const obj = {
          label: memberProgramsWithBatches[i].title + " - " + item1.name,
          value: item1.id,
        };
        overallArr.push(obj);
      });
    }

    return overallArr;
  };

  const approvePayment = async () => {
    await fetch(
      PaymentApis.APPROVE_PAYMENT({
        memberId: paymentToDecide.habuild_members.id,
        paymentId: paymentToDecide.id,
        selectedBatchId,
      })
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {});
  };

  // console.log("PaymentTO Decide", paymentToDecide);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Payment Approval</h1>

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Payment +
      </button>

      {loading ? (
        <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
      ) : (
        <>
          <Table columns={columns} dataSource={paymentsToApprove} />

          {paymentsToApprove.length == 0 && (
            <div className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                No Payment Logs
              </span>
            </div>
          )}
        </>
      )}

      <Modal
        // apiLoading={apiLoading}
        modalOpen={showScreenshotModal}
        setModalOpen={setShowScreenshotModal}
        actionText="Approve"
        onActionButtonClick={approvePayment}
      >
        <img src={imageToShow} />

        <h2>Amount - {paymentToDecide.amount}</h2>

        <Select
          onChange={(option) => {
            setSelectedBatchId(option.value);
          }}
          options={computeSelectOptions()}
          placeholder="Select Batch"
        ></Select>

        <input
          className="px-2 py-1 rounded-md w-full mt-4 border border-gray-400"
          placeholder="UTR"
          onChange={(e) => setUtr(e.target.value)}
          value={utr}
        />
      </Modal>

      {/* <ActionsSidePanel
        demoProgram={demoProgramForAction}
        initialTab={initialTab}
        // programs={programs}
        isOpen={showActionsPanel}
        setIsOpen={setShowActionsPanel}
      />

      <AddDemoProgramModal
        viewAddModal={viewAddModal}
        setViewAddModal={setViewAddModal}
        getAllDemoPrograms={getAllDemoPrograms}
        programs={programs}
      /> */}

      <AddPaymentForApproval
        viewModal={viewAddModal}
        setViewModal={setViewAddModal}
        getAllPaymentsToApprove={getAllPaymentsToApprove}
      />
    </div>
  );
};

const AddPaymentForApproval = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [csvArray, setCsvArray] = useState([]);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const paymentFormFields = [
    {
      label: "Name",
      value: name,
      type: "text",
      name: "name",
      setterMethod: setName,
    },
    {
      label: "Mobile Number",
      value: mobileNumber,
      type: "text",
      name: "mobileNumber",
      setterMethod: setMobileNumber,
    },
    {
      label: "Email",
      value: email,
      type: "text",
      name: "email",
      setterMethod: setEmail,
    },
    {
      label: "Amount",
      value: amount,
      type: "radio",
      name: "amount",
      setterMethod: setAmount,
      options: [
        {
          label: "849",
          value: "849",
          type: "radio",
          name: "amount",
          setterMethod: setAmount,
        },
        {
          label: "1799",
          value: "1799",
          type: "radio",
          name: "amount",
          setterMethod: setAmount,
        },
        {
          label: "2499",
          value: "2499",
          type: "radio",
          name: "amount",
          setterMethod: setAmount,
        },
        {
          label: "3999",
          value: "3999",
          type: "radio",
          name: "amount",
          setterMethod: setAmount,
        },
      ],
    },
  ];

  const processCSV = (str, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });

    console.log("New Arrr", newArray);

    setCsvArray(newArray);

    for (let i = 0; i < newArray.length; i++) {
      formSubmit({}, true, newArray[i]);
    }
  };

  const csvHandler = (file) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      console.log(text);
      processCSV(text);
    };

    reader.readAsText(file);
  };

  const formSubmit = (e, fromCSV, data) => {
    setApiLoading(true);

    console.log(amount);
    console.log(name);
    console.log(mobileNumber);
    console.log(email);

    let dataObj = {};

    if (!fromCSV) {
      e.preventDefault();

      if (!amount || !name || !mobileNumber || !email) {
        alert("Please enter all details.");
        setApiLoading(false);
        return;
      }

      dataObj = {
        "Mobile Number": mobileNumber,
        Email: email,
        Amount: amount,
        "Payment App ": "NA",
        Plan: "NA",
      };
    } else {
      dataObj = data;
    }

    let API = PaymentApis.CREATE_OFFLINE_PAYMENT();
    let method = "POST";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(dataObj);
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
          props.getAllPaymentsToApprove();
          props.setViewModal(false);
          // console.log("Api Result", result);
        });
    } catch {
      (error) => {
        setApiLoading(false);
        toast.error(
          `No payment ${props.mode == "edit" ? "Updated" : "Created"}`
        );
        console.log("error", error);
      };
    }
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.viewModal}
      setModalOpen={props.setViewModal}
      actionText="Add Payment"
      onActionButtonClick={formSubmit}
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          Payment For Approval
        </h2>

        {paymentFormFields.map((item) => {
          if (item.type == "radio") {
            return (
              <div key={item.label} className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                {item.options.map((item1) => {
                  return (
                    <div key={item1.label} className="flex flex-row space-x-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {item1.label}
                      </label>
                      <input
                        value={item1.value}
                        onChange={(e) => item.setterMethod(e.target.value)}
                        type={item1.type}
                        name={item1.name}
                        id={item1.name}
                        placeholder={item1.label}
                      ></input>
                    </div>
                  );
                })}
              </div>
            );
          }

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

        <label className="block text-sm font-medium text-gray-700 border-t border-gray-300 pt-4">
          Upload from CSV
        </label>
        <input
          type="file"
          accept=".csv"
          id="csvFile"
          onChange={(e) => {
            setApiLoading(true);
            csvHandler(e.target.files[0]);
          }}
        ></input>

        {csvArray.length > 0 && <p>{csvArray.length} Rows read from CSV.</p>}
      </form>
    </Modal>
  );
};

PaymentApproval.getLayout = LayoutSidebar;

export default PaymentApproval;
