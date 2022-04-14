import { useState, useEffect } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import Modal from "../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";

import { format, parseISO } from "date-fns";

const DemoBatches = () => {
  const [viewAddModal, setViewAddModal] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [demoBatches, setDemoBatches] = useState([]);

  useEffect(() => {
    getAllPrograms();
    getDemoBatches();
  }, []);

  const getDemoBatches = async () => {
    await fetch(`https://api.habuild.in/api/demobatches`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data", data);
        setDemoBatches(
          data.demoBatches.map((item) => {
            return {
              name: item.name,
              program_id: item.program_id,
              status: item.status,
              ad_id: item.ad_id,
              start_date: format(parseISO(item.start_date), "PPpp"),
              end_date: format(parseISO(item.end_date), "PPpp"),
            };
          })
        );
      });
  };

  const getAllPrograms = async () => {
    await fetch(`https://api.habuild.in/api/program/`)
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs);
      });
  };

  const columns = [
    // {
    //   title: "",
    //   dataIndex: "isSelected",
    //   key: "isSelected",
    //   renderHeader: true,
    //   headerRender: () => {
    //     return (
    //       <input
    //         onChange={(e) => handleSelectAll(e.target.checked)}
    //         className="mt-1 h-4 w-4 rounded-md border-gray-300 "
    //         type="checkbox"
    //       />
    //     );
    //   },
    //   render: (isSelected) => {
    //     return (
    //       <input
    //         onChange={(e) => handleSelect(isSelected.identifier)}
    //         className="mt-1 h-4 w-4 rounded-md border-gray-300 "
    //         type="checkbox"
    //         checked={isSelected.value}
    //       />
    //     );
    //   },
    // },
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
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (lead) => {
        return <FlyoutMenu menuItems={[]}></FlyoutMenu>;
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

      <Table columns={columns} dataSource={demoBatches} />

      <AddDemoBatchModal
        programs={programs}
        modalOpen={viewAddModal}
        setModalOpen={setViewAddModal}
      />
    </div>
  );
};

const AddDemoBatchModal = (props) => {
  const [name, setName] = useState("");
  const [programId, setProgramId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ad_id, setAd_id] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!name || !programId || !startDate || !endDate) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      name,
      program_id: programId,
      start_date: startDate,
      end_date: endDate,
      ad_id: ad_id,
      status: "INACTIVE",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // fetch("https://api.habuild.in/api/demobatches", requestOptions)
    fetch("http://localhost:4000/api/demobatches", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setApiLoading(false);
        toast.success("Demo Batch Created");
        console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        toast.error("Error");
        console.log("error", error);
      });
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      actionText="Add Lead"
      hideActionButtons
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add Demo Batch
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
            Ad id
          </label>
          <input
            value={ad_id}
            onChange={(e) => setAd_id(e.target.value)}
            type="text"
            name="ad_id"
            id="ad_id"
            placeholder="Ad id"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="program"
            className="block text-md font-medium text-gray-700"
          >
            Associated Program
          </label>

          <select
            onChange={(e) => setProgramId(e.target.value)}
            className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
          >
            <option></option>
            {props.programs.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            required
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
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
        </div>

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
