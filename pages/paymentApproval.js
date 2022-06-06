import { useState, useEffect } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import Modal from "../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";

import { format, parseISO } from "date-fns";
import Select from "react-select";

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

  const [memberProgramsWithBatches, setMemberProgramsWithBatches] = useState(
    []
  );

  useEffect(() => {
    getAllPaymentsToApprove();
    getMemberProgramsWithBatches();
  }, []);

  const getMemberProgramsWithBatches = () => {
    // fetch(`https://api.habuild.in/api/program/`)
    fetch(`http://localhost:4000/api/program/`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Program Data", data);
        const memberProgramsWithBatches = [];

        const newArr = [...memberProgramsWithBatches];
        for (let i = 0; i < data.programs.length; i++) {
          fetch(
            // `https://api.habuild.in/api/batch/program/${data.programs[i].id}`
            `http://localhost:4000/api/batch/program/${data.programs[i].id}`
          )
            .then((res) => {
              return res.json();
            })
            .then((data1) => {
              const obj = {
                ...data.programs[i],
                batches: data1.batch,
              };

              newArr.push(obj);
            });
        }
        setMemberProgramsWithBatches(newArr);
      });
  };

  const getAllPaymentsToApprove = async () => {
    setLoading(true);
    await fetch(`https://api.habuild.in/api/payment/offline_payments`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
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

  console.log("member Batches ", memberProgramsWithBatches);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Payment Approval</h1>

      {/* <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Demo Program +
      </button> */}

      {loading ? (
        <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
      ) : (
        <Table columns={columns} dataSource={paymentsToApprove} />
      )}

      <Modal
        // apiLoading={apiLoading}
        modalOpen={showScreenshotModal}
        setModalOpen={setShowScreenshotModal}
        actionText="Approve"
      >
        <img src={imageToShow} />

        <h2>Amount - {paymentToDecide.amount}</h2>

        <Select
          // onChange={(option) => {
          //   setSelectedTemplate(option.obj);
          //   setMessage(option.obj.body);
          // }}
          options={memberProgramsWithBatches.map((item) => {
            const overallArr = [];

            const arr = item.batches.map((item1) => {
              return {
                label: item.title + " - " + item1.name,
                value: item1.id,
              };
            });
            
            console.log("ARRR", arr);

            overallArr.push(...overallArr, ...arr);

            console.log("OverAll Artrrrrr", overallArr);

            return overallArr;
          })}
        ></Select>

        <input
          className="px-2 py-1 rounded-md w-full mt-4 border border-gray-400"
          placeholder="UTR"
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
    </div>
  );
};

PaymentApproval.getLayout = LayoutSidebar;

export default PaymentApproval;
