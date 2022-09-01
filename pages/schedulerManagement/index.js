import LayoutSidebar from "../../components/LayoutSidebar";
import useCheckAuth from "../../hooks/useCheckAuth";
import {
  CheckIcon,
  RefreshIcon,
  ArrowPathRounded,
} from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";
import { useFetchWrapper } from "../../utils/apiCall";
import { SchedulerApis } from "../../constants/apis";
import {
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
  RefreshIcon as RefreshSolid,
} from "@heroicons/react/solid";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ChangeTemplateSidePanel from "./ChangeTemplateSidePanel";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SchedulerManagement = (props) => {
  const checkAuthLoading = useCheckAuth(false);

  const { customFetch, user } = useFetchWrapper();

  const [apiLoading, setApiLoading] = useState(false);
  const [rerunLoading, setRerunLoading] = useState(false);
  const [schedulers, setSchedulers] = useState([]);
  const [timeVal, setTimeVal] = useState({});
  const [tempVal, setTempVal] = useState("");
  const [editing, setEditing] = useState(false);
  const [changeTemplateOpen, setChangeTemplateOpen] = useState(false);
  const [templateToUpdate, setTemplateToUpdate] = useState({});
  const [schedulerToUpdate, setSchedulerToUpdate] = useState({});
  const [schedulerIdForLoader, setSchedulerIdForLoader] = useState("");

  useEffect(() => {
    if (!checkAuthLoading) {
      getSchedulers();
    }
  }, [checkAuthLoading]);

  const getSchedulers = async () => {
    setApiLoading(true);

    const schedulersResult = await customFetch(
      SchedulerApis.GET_SCHEDULERS(),
      "GET",
      {}
    );

    const timingsResult = await customFetch(
      SchedulerApis.GET_TIMINGS(),
      "GET",
      {}
    );

    const templatesResult = await customFetch(
      SchedulerApis.GET_USED_WATI_TEMPLATES(),
      "GET",
      {}
    );

    const schedulers = schedulersResult.result;

    const newSchedulers = [];

    for (let i = 0; i < schedulers.length; i++) {
      const timings = timingsResult.result.filter(
        (item) => item.scheduler_id == schedulers[i].id
      );

      const templates = templatesResult.result.filter(
        (item) => item.scheduler_id == schedulers[i].id
      );

      const obj = {
        ...schedulers[i],
        timings,
        templates,
      };

      newSchedulers.push(obj);
    }

    // newSchedulers.sort((a, b) => a.id - b.id);

    setSchedulers(newSchedulers);
    setApiLoading(false);
  };

  const updateSchedulerTiming = async () => {
    const result = await customFetch(SchedulerApis.UPDATE_TIMING(), "POST", {
      id: timeVal.id,
      newTime: timeVal.time + ":00",
    });

    setTempVal("");
    setTimeVal({});
    setEditing(false);
    getSchedulers();
  };

  const resetSchedulerTiming = () => {
    setTempVal("");
    setTimeVal({});
    setEditing(false);
  };

  const changeSchedulerStatus = async (scheduler, calledFrom) => {
    setApiLoading(true);

    if (!window.confirm("Are you sure?")) {
      setApiLoading(false);
      return;
    }

    const API =
      calledFrom == "activate"
        ? SchedulerApis.ACTIVATE()
        : SchedulerApis.STOP();

    const result = await customFetch(API, "POST", {
      scheduler_id: scheduler.id,
    });

    if (result.ok) {
      toast.success("Updated scheduler status successfully");
      getSchedulers();
    } else {
      toast.error("Failed to updated scheduler status");
    }
    setApiLoading(false);
  };

  const rerunScheduler = async (scheduler) => {
    setRerunLoading(true);
    if (!window.confirm("Are you sure?")) {
      setRerunLoading(false);
      return;
    }

    const result = await customFetch(SchedulerApis.RERUN(), "POST", {
      scheduler_id: scheduler.id,
    });

    if (result.ok) {
      toast.success("Succesfully re-ran scheduler");
    } else {
      toast.error("Failed to rerun scheduler");
    }

    setRerunLoading(false);
  };

  const changeWatiTemplateStatus = async (scheduler, template, calledFrom) => {
    setApiLoading(true);

    if (!window.confirm("Are you sure?")) {
      setApiLoading(false);
      return;
    }

    const API =
      calledFrom == "enable"
        ? SchedulerApis.ACTIVATE_WATI_TEMPLATE()
        : SchedulerApis.DISABLE_WATI_TEMPLATE();

    const result = await customFetch(API, "POST", {
      scheduler_id: scheduler.id,
      template_id: template.wati_template_id,
    });

    if (result.ok) {
      toast.success("Succesfull");
      getSchedulers();
    } else {
      toast.error("Failed");
    }

    setApiLoading(false);
  };

  const changeDayStatus = async (scheduler_id, dayNum) => {
    setApiLoading(true);

    if (!window.confirm("Are you sure?")) {
      setApiLoading(false);
      return;
    }

    const result = await customFetch(
      SchedulerApis.CHANGE_DAY_STATUS(),
      "POST",
      {
        scheduler_id,
        day: dayNum,
      }
    );

    if (result.ok) {
      toast.success("Succesfully changed status for day");
      getSchedulers();
    } else {
      toast.error("Failed");
    }

    setApiLoading(false);
  };

  if (checkAuthLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin  h-8 w-8 mx-auto" />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-700">
        Scheduler Management
      </h1>

      {apiLoading && (
        <RefreshIcon className="text-green-300 animate-spin  h-8 w-8" />
      )}

      <div className="space-y-12 mt-8">
        {schedulers.map((sch) => {
          const status = sch.scheduler_status == "ACTIVE" ? true : false;

          return (
            <div
              key={sch.id}
              className="bg-white overflow-hidden shadow border border-gray-100 rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="space-x-4 sm:space-x-1 grid grid-cols-3 ">
                  <div>
                    <h1 className="break-all text-lg font-medium text-gray-900">
                      {sch.scheduler_name}
                    </h1>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                        status
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      } `}
                    >
                      <svg
                        className={`absolute -ml-0.5 mr-1.5 h-3 w-3 ${
                          status
                            ? "text-green-400 animate-ping"
                            : "text-red-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx={4} cy={4} r={3} />
                      </svg>
                      <svg
                        className={`relative -ml-0.5 mr-1.5 h-3 w-3 ${
                          status ? "text-green-400" : "text-red-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx={4} cy={4} r={3} />
                      </svg>
                      {sch.scheduler_status}
                    </span>
                  </div>

                  <div className="flex flex-row justify-self-center font-medium text-gray-500">
                    {weekDays.map((item, index) => {
                      const active = sch.days_active.charAt(index) == "1";

                      return (
                        <div
                          onClick={() => changeDayStatus(sch.id, index)}
                          key={index}
                          title={`Make ${
                            active ? "Inactive" : "Active"
                          } for day`}
                          className="px-2 rounded-md hover:bg-gray-100 cursor-pointer flex justify-center flex-col"
                        >
                          <span className="mx-auto">{item}</span>
                          {active ? (
                            <CheckCircleIcon className="mx-auto h-5 w-5 text-green-400" />
                          ) : (
                            <XCircleIcon className="mx-auto h-5 w-5 text-red-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <span className="justify-self-end px-2.5 py-0.5 rounded-md text-md font-bold text-gray-800">
                    {sch.scheduler_type}
                  </span>
                </div>

                <div className="flex flex-row space-x-2 mt-2 text-gray-700">
                  {sch.timings.map((item) => {
                    const showUpdate =
                      item.id == timeVal.id &&
                      item.timings.split("T")[1].substring(0, 5) !==
                        timeVal.time
                        ? true
                        : false;

                    return (
                      <div key={item.id}>
                        {!editing && timeVal.id !== item.id ? (
                          <input
                            onClick={() => {
                              setTimeVal({
                                time: "",
                                id: item.id,
                              });
                              setTempVal(
                                item.timings.split("T")[1].substring(0, 5)
                              );
                              setEditing(true);
                            }}
                            type="time"
                            className="px-3 py-1 rounded-md hover:bg-gray-100"
                            value={item.timings.split("T")[1].substring(0, 5)}
                          />
                        ) : (
                          <input
                            disabled={
                              timeVal.id !== undefined
                                ? timeVal.id !== item.id
                                  ? true
                                  : false
                                : false
                            }
                            type="time"
                            className="px-3 py-1 rounded-md hover:bg-gray-100"
                            onChange={(e) => {
                              if (
                                timeVal.id !== undefined &&
                                item.id !== timeVal.id
                              ) {
                                toast.error("Finish editing first timing");
                              } else {
                                setTempVal(
                                  item.timings.split("T")[1].substring(0, 5)
                                );
                                setTimeVal({
                                  time: e.target.value,
                                  id: item.id,
                                });
                              }
                            }}
                            defaultValue={item.timings
                              .split("T")[1]
                              .substring(0, 5)}
                          />
                        )}

                        {showUpdate && (
                          <>
                            <button
                              onClick={updateSchedulerTiming}
                              title="Update Time"
                              className="rounded-md text-green-600 hover:bg-green-300 px-2 py-1"
                            >
                              <CheckIcon className="h-4 w-4 " />
                            </button>
                            <button
                              onClick={resetSchedulerTiming}
                              title="Reset Time"
                              className="rounded-md text-red-600 hover:bg-red-300 px-2 py-1"
                            >
                              <XIcon className="h-4 w-4 " />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flow-root mt-6 max-w-4xl mx-auto">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {sch.templates.map((item) => {
                      return (
                        <div key={item.template.id}>
                          <li className="py-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate">
                                  {item.template.identifier}
                                </p>
                                <button
                                  onClick={() => {
                                    setSchedulerToUpdate(sch);
                                    setTemplateToUpdate(item);
                                    setChangeTemplateOpen(true);
                                  }}
                                  className="rounded-md text-sm text-gray-400 hover:text-gray-500 truncate"
                                >
                                  Change Template
                                </button>
                              </div>
                              <div>
                                {item.status ? (
                                  <button
                                    onClick={() =>
                                      changeWatiTemplateStatus(
                                        sch,
                                        item,
                                        "disable"
                                      )
                                    }
                                    type="button"
                                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 text-sm leading-5 font-medium rounded-full text-white bg-red-500 hover:bg-red-600"
                                  >
                                    Disable
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      changeWatiTemplateStatus(
                                        sch,
                                        item,
                                        "enable"
                                      )
                                    }
                                    type="button"
                                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 text-sm leading-5 font-medium rounded-full text-white bg-green-500 hover:bg-green-600"
                                  >
                                    Enable
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        </div>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="flex flex-row justify-between px-4 py-4 sm:px-6">
                {status ? (
                  <button
                    onClick={() => changeSchedulerStatus(sch, "stop")}
                    type="button"
                    className="inline-flex items-center px-8 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => changeSchedulerStatus(sch, "activate")}
                    type="button"
                    className="inline-flex items-center px-5 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => {
                    setSchedulerIdForLoader(sch.id);
                    rerunScheduler(sch);
                  }}
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-green-400 text-sm leading-4 font-medium rounded-md shadow-sm text-green-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <RefreshSolid
                    className={`h-5 w-5 ${
                      rerunLoading && schedulerIdForLoader == sch.id
                        ? "animate-spin"
                        : ""
                    }`}
                  />{" "}
                  Rerun Scheduler
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ChangeTemplateSidePanel
        open={changeTemplateOpen}
        setOpen={setChangeTemplateOpen}
        customFetch={customFetch}
        templateToUpdate={templateToUpdate}
        schedulerToUpdate={schedulerToUpdate}
        refetchData={getSchedulers}
      />
    </div>
  );
};

SchedulerManagement.getLayout = LayoutSidebar;

export default SchedulerManagement;
