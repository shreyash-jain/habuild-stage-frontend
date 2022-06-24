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
  TrashIcon,
  PlusIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { Switch } from "@headlessui/react";
import {
  DailyQuotesApis,
  DemoBatchesApis,
  ProgramsApis,
} from "../constants/apis";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DailyQuotes = (props) => {
  const [dailyQuotes, setDailyQuotes] = useState([]);
  const [memberDailyQuotes, setMemberDailyQuotes] = useState([]);
  const [leadDailyQuotes, setLeadDailyQuotes] = useState([]);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);

  const [demoBatches, setDemoBatches] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [editQuote, setEditQuote] = useState({});

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    getDailyQuotes();

    getAllPrograms();
    getDemoBatches();
  }, []);

  const getDailyQuotes = async () => {
    await fetch(DailyQuotesApis.GET())
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setDailyQuotes(
          data.dailyQuotes.map((item) => {
            return {
              ...item,
              action: item,
            };
          })
        );

        const filteredMemberQuotes = data.dailyQuotes.filter((item) => {
          if (item.type == "MEMBER") {
            return {
              ...item,
              action: item,
            };
          }
        });

        setMemberDailyQuotes(
          filteredMemberQuotes.map((item) => {
            return {
              ...item,
              action: item,
            };
          })
        );

        const filteredLeadQuotes = data.dailyQuotes.filter((item) => {
          if (item.type !== "MEMBER") {
            return {
              ...item,
              action: item,
            };
          }
        });

        setLeadDailyQuotes(
          filteredLeadQuotes.map((item) => {
            return {
              ...item,
              action: item,
            };
          })
        );
      });
  };

  const getDemoBatches = async () => {
    await fetch(DemoBatchesApis.GET_DEMO_BATCHES())
      .then((res) => res.json())
      .then((data) => {
        // console.log("Data", data);
        setDemoBatches(data.demoBatches);
      });
  };

  const getAllPrograms = async () => {
    await fetch(ProgramsApis.GET_PROGRAMS())
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
      title: "DayQuote",
      dataIndex: "day_id",
      key: "day_id",
    },
    !enabled && {
      title: "Highlight",
      dataIndex: "highlight",
      key: "highlight",
    },
    !enabled && {
      title: "Highlight_2",
      dataIndex: "highlight_2",
      key: "highlight_2",
    },
    !enabled && {
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
    enabled && {
      title: "Morning Message",
      dataIndex: "morning_message",
      key: "morning_message",
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Daily Quotes</h1>

      <div className="flex flex-row space-x-2 justify-center items-center">
        <p className="font-light text-lg">Show Member Quotes</p>

        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? "bg-green-600" : "bg-gray-200",
            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          >
            <span
              className={classNames(
                enabled
                  ? "opacity-0 ease-out duration-100"
                  : "opacity-100 ease-in duration-200",
                "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
              )}
              aria-hidden="true"
            >
              <svg
                className="h-3 w-3 text-gray-400"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={classNames(
                enabled
                  ? "opacity-100 ease-in duration-200"
                  : "opacity-0 ease-out duration-100",
                "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
              )}
              aria-hidden="true"
            >
              <svg
                className="h-3 w-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            </span>
          </span>
        </Switch>
      </div>

      <Table
        onPaginationApi={() => {}}
        columns={columns}
        pagination
        dataSource={enabled ? memberDailyQuotes : leadDailyQuotes}
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

  const [quoteFormArray, setQuoteFormArray] = useState([
    {
      date: "",
      demo_batch_id: "",
      highlight: "",
      highlight_2: "",
      program_id: "",
      quote_1: "",
      quote_2: "",
      quote_3: "",
      status: "",
      tip: "",
    },
  ]);

  useEffect(() => {
    if (props.editQuote) {
      if (props.mode == "edit") {
        const newArr = [
          {
            date: props.editQuote?.date?.split("T")[0],
            demo_batch_id: props.editQuote.demo_batch_id,
            highlight: props.editQuote.highlight,
            highlight_2: props.editQuote.highlight_2,
            program_id: props.editQuote.program_id,
            quote_1: props.editQuote.quote_1,
            quote_2: props.editQuote.quote_2,
            quote_3: props.editQuote.quote_3,
            status: props.editQuote.status,
            tip: props.editQuote.tip,
          },
        ];

        setQuoteFormArray(newArr);
      }
    }
  }, [props.editQuote]);

  const handleQuoteFormChange = (fieldName, index, value) => {
    const newArr = [...quoteFormArray];

    newArr[index][fieldName] = value;

    setQuoteFormArray(newArr);
  };

  const formSubmit = (e) => {
    let API = DailyQuotesApis.CREATE();
    let method = "POST";

    if (props.mode == "edit") {
      API = DailyQuotesApis.UPDATE(props.editQuote.id);
      method = "PATCH";
    }

    e.preventDefault();
    setApiLoading(true);

    for (let i = 0; i < quoteFormArray.length; i++) {
      const item = quoteFormArray[i];

      if (
        !item.date ||
        !item.highlight ||
        !item.highlight_2 ||
        !item.quote_1 ||
        !item.quote_2 ||
        !item.quote_3 ||
        !item.status ||
        !item.tip ||
        !item.program_id ||
        !item.demo_batch_id
      ) {
        alert("Please enter all details.");
        setApiLoading(false);
        return;
      }
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        date: item.date + " 01:00:00",
        highlight: item.highlight,
        highlight_2: item.highlight_2,
        quote_1: item.quote_1,
        quote_2: item.quote_2,
        quote_3: item.quote_3,
        status: item.status,
        tip: item.tip,
        program_id: item.program_id,
        demo_batch_id: item.demo_batch_id,
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
              `Daily Quote ${props.mode == "edit" ? "Updated" : "Created"}`
            );
            // props.getQuotes();
            // props.setViewModal(false);
            // console.log("Api Result", result);
          });
      } catch {
        (error) => {
          setApiLoading(false);
          toast.error(
            `No quote ${props.mode == "edit" ? "Updated" : "Created"}`
          );
          // console.log("error", error);
        };
      }
      props.getQuotes();
      props.setViewModal(false);
    }
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.viewModal}
      setModalOpen={props.setViewModal}
      hideActionButtons
    >
      <h2 className="text-left text-xl font-bold text-gray-900">
        {props.mode == "edit" ? "Edit" : "Add"} Quote
      </h2>
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        {quoteFormArray.length > 0 &&
          quoteFormArray?.map((item, index) => {
            return (
              <div className="grid grid-cols-10 space-x-2 mb-4" key={index}>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    value={item.date}
                    onChange={(e) =>
                      handleQuoteFormChange("date", index, e.target.value)
                    }
                    type="date"
                    name="date"
                    id="date"
                    placeholder="Date"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlight
                  </label>
                  <input
                    value={item.highlight}
                    onChange={(e) =>
                      handleQuoteFormChange("highlight", index, e.target.value)
                    }
                    type="text"
                    name="highlight"
                    id="highlight"
                    placeholder="Highlight"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlight 2
                  </label>
                  <input
                    value={item.highlight_2}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "highlight_2",
                        index,
                        e.target.value
                      )
                    }
                    type="text"
                    name="highlight_2"
                    id="highlight_2"
                    placeholder="Highlight 2"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Quote 1
                  </label>
                  <input
                    value={item.quote_1}
                    onChange={(e) =>
                      handleQuoteFormChange("quote_1", index, e.target.value)
                    }
                    type="text"
                    placeholder="Quote 1"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Quote 2
                  </label>
                  <input
                    value={item.quote_2}
                    onChange={(e) =>
                      handleQuoteFormChange("quote_2", index, e.target.value)
                    }
                    type="text"
                    placeholder="Quote 3"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Quote 3
                  </label>
                  <input
                    value={item.quote_3}
                    onChange={(e) =>
                      handleQuoteFormChange("quote_3", index, e.target.value)
                    }
                    type="text"
                    placeholder="Quote 3"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <input
                    value={item.status}
                    onChange={(e) =>
                      handleQuoteFormChange("status", index, e.target.value)
                    }
                    type="text"
                    placeholder="Status"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Tip
                  </label>
                  <input
                    value={item.tip}
                    onChange={(e) =>
                      handleQuoteFormChange("tip", index, e.target.value)
                    }
                    type="text"
                    placeholder="Tip"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label
                    htmlFor="program"
                    className="block text-md font-medium text-gray-700"
                  >
                    Associated Program
                  </label>

                  <select
                    value={item.program_id}
                    onChange={(e) =>
                      handleQuoteFormChange("program_id", index, e.target.value)
                    }
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

                <div className="col-span-1 ">
                  <label
                    htmlFor="program"
                    className="block text-md font-medium text-gray-700"
                  >
                    Associated Demo Batch
                  </label>

                  <select
                    value={item.demo_batch_id}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "demo_batch_id",
                        index,
                        e.target.value
                      )
                    }
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
                  onClick={() => {
                    const newArr = [...quoteFormArray];

                    newArr.splice(index, 1);

                    setQuoteFormArray(newArr);
                  }}
                  className="w-4"
                  title="Delete Quote"
                >
                  <TrashIcon className="font-medium text-red-200 h-4 w-4 hover:text-red-400" />
                </button>
              </div>
            );
          })}
      </form>

      {props.mode !== "edit" && (
        <button
          onClick={() => {
            const newArr = [...quoteFormArray];
            newArr.push({
              total_days_absent: "",
              total_days_present: "",
              day_presence: "",
              message: "",
              status: "",
              program_id: "",
              demo_batch_id: "",
            });
            setQuoteFormArray(newArr);
          }}
          className="mb-4 font-medium text-gray-500 bg-gray-200 hover:bg-gray-400 hover:text-white py-2 px-4 rounded-md"
        >
          <PlusIcon className="h-4 w-4 mx-auto" />
        </button>
      )}

      <button
        onClick={formSubmit}
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
      >
        {props.mode == "edit" ? "Edit" : "Add"} Quote
        {apiLoading && (
          <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
        )}
      </button>
    </Modal>
  );
};

DailyQuotes.getLayout = LayoutSidebar;

export default DailyQuotes;
