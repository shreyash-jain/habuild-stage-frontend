import { useEffect, useState, Fragment, useContext } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";
import Modal from "../components/Modal";
import {
  RefreshIcon,
  XCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { Switch } from "@headlessui/react";
import {
  AttendanceQuotesApis,
  DemoBatchesApis,
  ProgramsApis,
} from "../constants/apis";
import useCheckAuth from "../hooks/useCheckAuth";
import { useFetchWrapper } from "../utils/apiCall";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AttendanceQuotes = (props) => {
  // const checkAuthLoading = useCheckAuth(false);
  const checkAuthLoading = false;

  const { customFetch, user } = useFetchWrapper();

  const [loading, setLoading] = useState(false);
  const [attendnaceQuotes, setAttendanceQuotes] = useState([]);
  const [absentAttendanceQuotes, setAbsentAttendanceQuotes] = useState([]);
  const [presentAttendanceQuotes, setPresentAttendanceQuotes] = useState([]);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [demoBatches, setDemoBatches] = useState([]);

  const [editQuote, setEditQuote] = useState({});

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!checkAuthLoading) {
      getAllPrograms();
      getDemoBatches();
      getAttendanceQuotes();
    }
  }, []);

  const getAttendanceQuotes = async () => {
    setLoading(true);
    const data = await customFetch(
      AttendanceQuotesApis.GET_ATTENDANCE_QUOTES(),
      "GET",
      {}
    );

    setAttendanceQuotes(
      data.attendanceQuotes.map((item) => {
        return {
          ...item,
          action: item,
        };
      })
    );

    let absentQuotes = data.attendanceQuotes.filter((item) => {
      if (!parseInt(item.day_presence)) {
        return true;
      }
    });

    absentQuotes = absentQuotes.map((item) => {
      return {
        ...item,
        action: item,
      };
    });

    setAbsentAttendanceQuotes(
      absentQuotes.sort(function (a, b) {
        return a.total_days_absent - b.total_days_absent;
      })
    );

    let presentQuotes = data.attendanceQuotes.filter((item) => {
      if (parseInt(item.day_presence)) {
        return true;
      }
    });

    presentQuotes = presentQuotes.map((item) => {
      return {
        ...item,
        action: item,
      };
    });

    setPresentAttendanceQuotes(
      presentQuotes.sort(function (a, b) {
        return a.total_days_present - b.total_days_present;
      })
    );

    setLoading(false);
  };

  const getDemoBatches = async () => {
    const data = await customFetch(
      DemoBatchesApis.GET_DEMO_BATCHES(),
      "GET",
      {}
    );
    // console.log("Data", data);
    setDemoBatches(data.demoBatches);
  };

  const getAllPrograms = async () => {
    const data = await customFetch(ProgramsApis.GET_PROGRAMS(), "GET", {});

    setPrograms(data.programs);
  };

  const deleteAttendanceQuote = async (id) => {
    setLoading(true);
    const data = await customFetch(
      AttendanceQuotesApis.DELETE(id),
      "DELETE",
      {}
    );
    // console.log("Data", res);
    setLoading(false);
    getAttendanceQuotes();
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
    enabled
      ? {
          title: "Total Days Absent",
          dataIndex: "total_days_absent",
          key: "total_days_absent",
        }
      : {
          title: "Total Days Present",
          dataIndex: "total_days_present",
          key: "total_days_present",
        },
    {
      title: "Day Presence",
      dataIndex: "day_presence",
      key: "day_presence",
      render: (presence) => {
        return (
          <>
            {presence ? (
              <CheckCircleIcon className="text-green-400 h-6" />
            ) : (
              <XCircleIcon className="text-red-400 h-6" />
            )}
          </>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Program",
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

  if (checkAuthLoading) {
    return <RefreshIcon className="text-green-300 h-8 w-8 mx-auto" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Attendance Quotes
      </h1>

      <div className="flex flex-row space-x-2 justify-left">
        <button
          className={`font-medium px-4 py-2 rounded-md ${
            enabled
              ? "bg-green-300 text-green-700"
              : "bg-red-300 text-red-700  opacity-50 hover:opacity-100"
          }`}
          onClick={() => {
            setEnabled(!enabled);
          }}
          disabled={enabled}
        >
          {enabled ? "" : "Show"} Absent Quotes
        </button>

        <button
          className={`font-medium px-4 py-2 rounded-md ${
            enabled
              ? "bg-red-300 text-red-700 opacity-50 hover:opacity-100"
              : "bg-green-300 text-green-700"
          }`}
          onClick={() => {
            setEnabled(!enabled);
          }}
          disabled={!enabled}
        >
          {enabled ? "Show" : ""} Present Quotes
        </button>
      </div>

      {loading ? (
        <RefreshIcon className="text-green-300 animate-spin h-8 w-8 mx-auto" />
      ) : (
        <Table
          onPaginationApi={() => {}}
          columns={columns}
          pagination
          dataSource={
            enabled ? absentAttendanceQuotes : presentAttendanceQuotes
          }
        />
      )}

      {/* <button
        // onClick={() => setViewAddLeadModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Member +
      </button> */}

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Attendance Quote +
      </button>

      <AddAttendanceQuote
        demoBatches={demoBatches}
        programs={programs}
        getQuotes={getAttendanceQuotes}
        viewModal={viewAddModal}
        setViewModal={setViewAddModal}
      />

      <AddAttendanceQuote
        editQuote={editQuote}
        demoBatches={demoBatches}
        programs={programs}
        getQuotes={getAttendanceQuotes}
        viewModal={viewEditModal}
        setViewModal={setViewEditModal}
        mode="edit"
      />
    </div>
  );
};

const AddAttendanceQuote = (props) => {
  const [apiLoading, setApiLoading] = useState(false);

  const [quoteFormArray, setQuoteFormArray] = useState([
    {
      total_days_absent: "",
      total_days_present: "",
      day_presence: "",
      message: "",
      status: "",
      program_id: "",
      demo_batch_id: "",
    },
  ]);

  useEffect(() => {
    if (props.mode == "edit") {
      const newArr = [
        {
          total_days_absent: props.editQuote?.total_days_present,
          total_days_present: props.editQuote?.total_days_absent,
          day_presence: props.editQuote?.day_presence,
          message: props.editQuote?.message,
          status: props.editQuote?.status,
          program_id: props.editQuote?.program_id,
          demo_batch_id: props.editQuote?.demo_batch_id,
        },
      ];

      setQuoteFormArray(newArr);
    }
  }, [props.viewModal]);

  const handleQuoteFormChange = (fieldName, index, value) => {
    const newArr = [...quoteFormArray];

    newArr[index][fieldName] = value;

    setQuoteFormArray(newArr);
  };

  const formSubmit = async () => {
    let API = AttendanceQuotesApis.CREATE();
    let method = "POST";

    if (props.mode == "edit") {
      API = AttendanceQuotesApis.UPDATE(props.editQuote.id);
      method = "PATCH";
    }

    setApiLoading(true);

    for (let i = 0; i < quoteFormArray.length; i++) {
      const item = quoteFormArray[i];
      if (
        !item.total_days_present ||
        !item.total_days_absent ||
        !item.day_presence ||
        !item.message ||
        !item.status ||
        !item.program_id ||
        !item.demo_batch_id
      ) {
        alert("Please enter all details.");
        setApiLoading(false);
        return;
      }

      var raw = {
        total_days_absent: item.total_days_absent,
        total_days_present: item.total_days_present,
        day_presence: item.day_presence,
        message: item.message,
        status: item.status,
        program_id: item.program_id,
        demo_batch_id: item.demo_batch_id,
      };

      try {
        await customFetch(API, method, raw);

        setApiLoading(false);
        toast.success(
          `Attendance Quote ${props.mode == "edit" ? "Updated" : "Created"}`
        );
        // console.log(result);
      } catch (error) {
        setApiLoading(false);
        toast.error(`Error ${JSON.stringify(error)}`);
        console.log("error", error);
      }
    }

    props.getQuotes();
    props.setViewModal(false);
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
        className="w-full my-8"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {quoteFormArray.length > 0 &&
          quoteFormArray?.map((item, index) => {
            return (
              <div className="grid grid-cols-11 space-x-2 mb-4" key={index}>
                <div className="col-span-1 ">
                  <label className="block text-xs font-medium text-gray-700">
                    Total Days Present
                  </label>
                  <input
                    value={item.total_days_present}
                    // onChange={(e) => setDaysPresent(e.target.value)}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "total_days_present",
                        index,
                        e.target.value
                      )
                    }
                    type="number"
                    name="total_days_present"
                    id="total_days_present"
                    placeholder="Total Days Present"
                    className="mt-1 p-2 text-lg focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block no-wrap text-xs font-medium text-gray-700">
                    Total Days Absent
                  </label>
                  <input
                    value={item.total_days_absent}
                    // onChange={(e) => setDaysAbsent(e.target.value)}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "total_days_absent",
                        index,
                        e.target.value
                      )
                    }
                    type="number"
                    name="total_days_absent"
                    id="total_days_absent"
                    placeholder="Total Days Absent"
                    className="mt-1 p-2 text-lg focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-xs font-medium text-gray-700">
                    Day Presence
                  </label>
                  <select
                    value={item.day_presence}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "day_presence",
                        index,
                        e.target.value
                      )
                    }
                    className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
                  >
                    <option></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
                <div className="col-span-3 ">
                  <label className="block text-xs font-medium text-gray-700">
                    Message
                  </label>
                  <input
                    value={item.message}
                    onChange={(e) =>
                      handleQuoteFormChange("message", index, e.target.value)
                    }
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Message"
                    className="mt-1 p-2 text-lg focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-xs font-medium text-gray-700">
                    Status
                  </label>
                  <input
                    value={item.status}
                    onChange={(e) =>
                      handleQuoteFormChange("status", index, e.target.value)
                    }
                    type="text"
                    placeholder="Status"
                    className="mt-1 p-2 text-lg focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-2 ">
                  <label
                    htmlFor="program"
                    className="block text-xs font-medium text-gray-700"
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

                <div className="col-span-2 ">
                  <label
                    htmlFor="program"
                    className="block text-xs font-medium text-gray-700"
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
        className="max-w-fit inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
        onClick={formSubmit}
      >
        {props.mode == "edit" ? "Edit" : "Add"} Quote
        {apiLoading && (
          <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
        )}
      </button>
    </Modal>
  );
};

AttendanceQuotes.getLayout = LayoutSidebar;

export default AttendanceQuotes;
