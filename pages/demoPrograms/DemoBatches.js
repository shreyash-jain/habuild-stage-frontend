import { useState, useEffect } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Modal from "../../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";

import { format, parseISO } from "date-fns";

const DemoBatches = (props) => {
  const [viewAddModal, setViewAddModal] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [demoBatches, setDemoBatches] = useState([]);

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getAllPrograms();
  }, []);

  useEffect(() => {
    setDemoBatches(
      props.demoBatches?.map((item) => {
        return {
          name: item.name,
          program_id: item.program_id,
          status: item.status,
          ad_id: item.ad_id,
          action: item,
        };
      })
    );
  }, [props.demoBatches?.length]);

  const getAllPrograms = async () => {
    await fetch(`https://api.habuild.in/api/program/`)
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs);
      });
  };

  const deleteDemoBatch = async (demoBatch) => {
    console.log("Demo Batch", demoBatch);
    if (!window.confirm("Are you sure?")) {
      return;
    }

    setDeleteLoading(true);
    await fetch(
      `https://api.habuild.in/api/demoprogram/delBatch?id=${demoBatch.id}`,
      // `http://localhost:4000/api/demobatches/delDemoBatch?id=${demoBatch.id}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      setDeleteLoading(false);
      props.getDemoBatches();
      if (res.status == 404) {
        toast.error("Demo Batch Not Deleted.");
      } else {
        toast.success("Demo Batch Deleted.");
      }
    });
  };

  const menuItems = [
    {
      name: "Delete",
      onClick: (actionEntity) => {
        deleteDemoBatch(actionEntity);
      },
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Program Id",
      dataIndex: "program_id",
      key: "program_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ad id",
      dataIndex: "ad_id",
      key: "ad_id",
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
      <h1 className="text-2xl font-semibold text-gray-900">Demo Batches</h1>

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Demo Batch +
      </button>

      <Table columns={columns} dataSource={demoBatches ? demoBatches : []} />

      <AddDemoBatchModal
        refreshData={props.getDemoBatches}
        demoProgram={props.demoProgram}
        programs={programs}
        modalOpen={viewAddModal}
        setModalOpen={setViewAddModal}
      />
    </div>
  );
};

const AddDemoBatchModal = (props) => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");

  const [apiLoading, setApiLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!name || !startTime) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      name,
      start_time:
        props.demoProgram.start_date.toString().split("T")[0] +
        " " +
        startTime +
        ":00",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      // `http://localhost:4000/api/demoprogram/addBatch?id=${props.demoProgram.id}`,
      `https://api.habuild.in/api/demoprogram/addBatch?id=${props.demoProgram.id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setApiLoading(false);
        props.refreshData();
        props.setModalOpen(false);
        toast.success("Demo Batch Created");
      })
      .catch((error) => {
        setApiLoading(false);
        toast.error("Error");
        console.log("error", error);
      });
  };

  console.log(
    "Get Time !!!!!@@@@"
    // new Date(props.demoProgram.start_date).setTime(startTime)
  );

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      hideActionButtons
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add Demo Batch for {props.demoProgram.name}
        </h2>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            placeholder="Name"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            onChange={(e) => setStartTime(e.target.value)}
            type="time"
            required
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        {/* <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            onChange={(e) => setEndDate(e.target.value)}
            required
            type="date"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div> */}

        <button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          type="submit"
        >
          Add Demo Batch
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

DemoBatches.getLayout = LayoutSidebar;

export default DemoBatches;
