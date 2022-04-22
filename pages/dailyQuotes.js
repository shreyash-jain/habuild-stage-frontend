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

const DailyQuotes = (props) => {
  const [dailyQuotes, setDailyQuotes] = useState([]);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);

  const [demoBatches, setDemoBatches] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [editQuote, setEditQuote] = useState({});

  useEffect(() => {
    getDailyQuotes();

    getAllPrograms();
    getDemoBatches();
  }, []);

  const getDailyQuotes = async () => {
    await fetch(
      "https://api.habuild.in/api/daily_quote/all_daily_quotes?limit=1000"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDailyQuotes(
          data.dailyQuotes.map((item) => {
            return {
              ...item,
              action: item,
            };
          })
        );
      });
  };

  const getDemoBatches = async () => {
    await fetch(`https://api.habuild.in/api/demobatches`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Data", data);
        setDemoBatches(data.demoBatches);
      });
  };

  const getAllPrograms = async () => {
    await fetch(`https://api.habuild.in/api/program/`)
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs);
      });
  };

  const menuItems = [
    {
      name: "Edit",
      onClick: (actionEntity) => {
        setEditQuote(actionEntity);
        setViewEditModal(true);
      },
    },
    {
      name: "Delete",
      onClick: (actionEntity) => {
        if (window.confirm("Are you sure you want to Delete this quote?")) {
          deleteAttendanceQuote(actionEntity.id);
        }
      },
    },
    // {
    //   name: "View Attendance",
    //   onClick: () => {
    //     setViewAttendanceModal(!viewAttendanceModal);
    //   },
    // },
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Highlight",
      dataIndex: "highlight",
      key: "highlight",
    },
    {
      title: "Highlight_2",
      dataIndex: "highlight_2",
      key: "highlight_2",
    },
    {
      title: "Tip",
      dataIndex: "tip",
      key: "tip",
    },
    // {
    //   title: "Tip 2",
    //   dataIndex: "tip_2",
    //   key: "tip_2",
    // },
    // {
    //   title: "Tip 3",
    //   dataIndex: "tip_3",
    //   key: "tip_3",
    // },
    {
      title: "Quote 1",
      dataIndex: "quote_1",
      key: "quote_1",
    },
    {
      title: "Quote 2",
      dataIndex: "quote_2",
      key: "quote_2",
    },
    {
      title: "Quote 3",
      dataIndex: "quote_3",
      key: "quote_3",
    },
    {
      title: "Program Id",
      dataIndex: "program_id",
      key: "program_id",
    },
    {
      title: "Demo Batch",
      dataIndex: "demo_batch_id",
      key: "demo_batch_id",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (obj) => {
        return (
          <FlyoutMenu actionEntity={obj} menuItems={menuItems}></FlyoutMenu>
        );
      },
    },
  ];

  console.log("Edit Quote", editQuote);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Daily Quotes</h1>

      <Table
        onPaginationApi={() => {}}
        columns={columns}
        pagination
        dataSource={dailyQuotes}
      />

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Daily Quote +
      </button>

      <DailyQuoteFormModal
        demoBatches={demoBatches}
        programs={programs}
        getQuotes={getDailyQuotes}
        viewModal={viewAddModal}
        setViewModal={setViewAddModal}
      />

      <DailyQuoteFormModal
        editQuote={editQuote}
        demoBatches={demoBatches}
        programs={programs}
        getQuotes={getDailyQuotes}
        viewModal={viewEditModal}
        setViewModal={setViewEditModal}
        mode="edit"
      />
    </div>
  );
};

const DailyQuoteFormModal = (props) => {
  const [date, setDate] = useState("");
  const [demo_batch_id, setDemoBatchId] = useState("");
  const [highlight, setHighlight] = useState("");
  const [highlight_2, setHighlight2] = useState("");
  const [program_id, setProgramId] = useState("");
  const [quote_1, setQuote1] = useState("");
  const [quote_2, setQuote2] = useState("");
  const [quote_3, setQuote3] = useState("");
  const [status, setStatus] = useState("");
  const [tip, setTip] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    if (props.mode == "edit") {
      setDate(props.editQuote.date?.split("T")[0]);
      setDemoBatchId(props.editQuote.demo_batch_id);
      setHighlight(props.editQuote.highlight);
      setHighlight2(props.editQuote.highlight_2);
      setProgramId(props.editQuote.program_id);
      setQuote1(props.editQuote.quote_1);
      setQuote2(props.editQuote.quote_2);
      setQuote3(props.editQuote.quote_3);
      setStatus(props.editQuote.status);
      setTip(props.editQuote.tip);
    }
  }, [props.viewModal]);

  const formSubmit = (e) => {
    let API = "https://api.habuild.in/api/daily_quote/add_daily_quotes";
    let method = "POST";

    if (props.mode == "edit") {
      API = `https://api.habuild.in/api/daily_quote/update/${props.editQuote.id}`;
      method = "PATCH";
    }

    e.preventDefault();
    setApiLoading(true);
    if (
      !date ||
      !highlight ||
      !highlight_2 ||
      !quote_1 ||
      !quote_2 ||
      !quote_3 ||
      !status ||
      !tip ||
      !program_id ||
      !demo_batch_id
    ) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      date: date + " 01:00:00",
      highlight,
      highlight_2,
      quote_1,
      quote_2,
      quote_3,
      status,
      tip,
      program_id,
      demo_batch_id,
    });
    var requestOptions = {
      method: method,
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    console.log(API);
    console.log(method);

    try {
      fetch(API, requestOptions)
        .then((response) => {
          console.log("response", response);
          return response.text();
        })
        .then((result) => {
          setApiLoading(false);
          toast.success(
            `Daily Quote ${props.mode == "edit" ? "Updated" : "Created"}`
          );
          props.getQuotes();
          props.setViewModal(false);
          console.log("Api Result", result);
        });
    } catch {
      (error) => {
        setApiLoading(false);
        toast.error(`No quote ${props.mode == "edit" ? "Updated" : "Created"}`);
        console.log("error", error);
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
          {props.mode == "edit" ? "Edit" : "Add"} Quote
        </h2>

        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            name="date"
            id="date"
            placeholder="Date"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Highlight
          </label>
          <input
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            type="text"
            name="highlight"
            id="highlight"
            placeholder="Highlight"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Highlight 2
          </label>
          <input
            value={highlight_2}
            onChange={(e) => setHighlight2(e.target.value)}
            type="text"
            name="highlight_2"
            id="highlight_2"
            placeholder="Highlight 2"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Quote 1
          </label>
          <input
            value={quote_1}
            onChange={(e) => setQuote1(e.target.value)}
            type="text"
            placeholder="Quote 1"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Quote 2
          </label>
          <input
            value={quote_2}
            onChange={(e) => setQuote2(e.target.value)}
            type="text"
            placeholder="Quote 3"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Quote 3
          </label>
          <input
            value={quote_3}
            onChange={(e) => setQuote3(e.target.value)}
            type="text"
            placeholder="Quote 3"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            type="text"
            placeholder="Status"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Tip</label>
          <input
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            type="text"
            placeholder="Tip"
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
            value={program_id}
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

        <div>
          <label
            htmlFor="program"
            className="block text-md font-medium text-gray-700"
          >
            Associated Demo Batch
          </label>

          <select
            value={demo_batch_id}
            onChange={(e) => setDemoBatchId(e.target.value)}
            className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
          >
            <option></option>
            {props.demoBatches.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          type="submit"
        >
          {props.mode == "edit" ? "Edit" : "Add"} Quote
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

DailyQuotes.getLayout = LayoutSidebar;

export default DailyQuotes;
