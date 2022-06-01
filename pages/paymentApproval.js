import { useState, useEffect } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import Modal from "../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";

import { format, parseISO } from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PaymentApproval = () => {
  const [viewAddModal, setViewAddModal] = useState(false);
  const [demoBatches, setDemoBatches] = useState([]);

  const [demoPrograms, setDemoPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [demoProgramForAction, setDemoProgramForAction] = useState({});
  const [initialTab, setInitialTab] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [imageToShow, setImageToShow] = useState("");

  useEffect(() => {
    getAllDemoPrograms();
    getAllPrograms();
    // getDemoBatches();
  }, []);

  const getAllPrograms = async () => {
    await fetch(`https://api.habuild.in/api/program/`)
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs);
      });
  };

  const getAllDemoPrograms = async () => {
    setLoading(true);
    await fetch(`https://api.habuild.in/api/demoprogram/?page=1&limit=10`)
      // await fetch(`http://localhost:4000/api/demoprogram/?page=1&limit=10`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDemoPrograms(
          data.data.map((item) => {
            return {
              ...item,
              action: item,
            };
          })
        );
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

  const deleteDemoProgram = async (demoProgram) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    setDeleteLoading(true);
    await fetch(
      `https://api.habuild.in/api/demoprogram/deleteDemoProgram?id=${demoProgram.id}`,
      // `http://localhost:4000/api/demoprogram/deleteDemoProgram?id=${demoProgram.id}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      setDeleteLoading(false);
      getAllDemoPrograms();
      if (res.status == 404) {
        toast.error("Demo Program Not Deleted.");
      }
    });
  };

  const menuItems = [
    {
      name: "Approve",
      onClick: (actionEntity) => {
        // setDemoProgramForAction(actionEntity);
        // setShowActionsPanel(true);
        // setInitialTab("View/Manage Batches");
      },
    },
    {
      name: "Deny",
      onClick: (actionEntity) => {
        // setShowActionsPanel(true);
        // setDemoProgramForAction(actionEntity);
        // setInitialTab("View/Manage Ads");
      },
    },
  ];

  const columns = [
    {
      title: "Mobile Number",
      dataIndex: "Mobile Number",
      key: "Mobile Number",
    },
    {
      title: "Payment Screenshot",
      dataIndex: "Payment Screenshot",
      key: "Payment Screenshot",
      render: (link) => {
        return (
          <>
            <img
              onClick={() => {
                setImageToShow(link);
                setShowScreenshotModal(true);
              }}
              src={link}
              alt=""
              className="w-20 rounded-md hover:cursor-pointer hover:opacity-75"
            />
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
    },
    {
      title: "Payment App",
      dataIndex: "Payment App ",
      key: "Payment App ",
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
        <Table
          columns={columns}
          dataSource={[
            {
              "Payment Screenshot":
                "https://drive.google.com/uc?id=1S6QUl-CXuQ5wkruPFpGF7G37IF5_ogdF&export=download",
              "Mobile Number": "8146524618",
              Email: "japneet.singh786@gmail.com",
              Amount: "1300",
              "Payment App ": "Google Pay",
              Plan: "3 Months",
            },
          ]}
        />
      )}

      <Modal
        // apiLoading={apiLoading}
        modalOpen={showScreenshotModal}
        setModalOpen={setShowScreenshotModal}
        hideActionButtons
      >
        <img src={imageToShow} />

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
