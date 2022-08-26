import LayoutSidebar from "../../components/LayoutSidebar";
import useCheckAuth from "../../hooks/useCheckAuth";
import { CheckIcon, RefreshIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";
import { useFetchWrapper } from "../../utils/apiCall";
import { SchedulerApis } from "../../constants/apis";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ChangeTemplateSidePanel from "./ChangeTemplateSidePanel";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const people = [
  {
    name: "Leonard Krasner",
    handle: "leonardkrasner",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    handle: "floydmiles",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Emily Selman",
    handle: "emilyselman",
    imageUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Kristin Watson",
    handle: "kristinwatson",
    imageUrl:
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const SchedulerManagement = (props) => {
  const checkAuthLoading = false;
  const { customFetch, user } = useFetchWrapper();

  const [apiLoading, setApiLoading] = useState(false);
  const [schedulers, setSchedulers] = useState([]);
  const [timeVal, setTimeVal] = useState({});
  const [tempVal, setTempVal] = useState("");
  const [editing, setEditing] = useState(false);
  const [changeTemplateOpen, setChangeTemplateOpen] = useState(false);

  useEffect(() => {
    getSchedulers();
  }, []);

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

    setSchedulers(newSchedulers);
    setApiLoading(false);
  };

  const updateSchedulerTiming = async () => {
    const result = await customFetch(SchedulerApis.UPDATE_TIMING(), "POST", {
      id: timeVal.id,
      newTime: timeVal.time + ":00",
    });

    console.log("result", result);

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

      <div className="space-y-6 mt-8">
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
                      <>
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
                      </>
                    );
                  })}
                </div>

                <div className="flow-root mt-6 max-w-4xl mx-auto">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {/* {people.map((person) => ( */}
                    <li className="py-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-md font-medium text-gray-900 truncate">
                            Wati Template 1
                          </p>
                          <button
                            onClick={() => setChangeTemplateOpen(true)}
                            className="rounded-md text-sm text-gray-400 hover:text-gray-500 truncate"
                          >
                            Change Template
                          </button>
                        </div>
                        <div>
                          <button className="inline-flex items-center shadow-sm px-2.5 py-0.5 text-sm leading-5 font-medium rounded-full text-white bg-red-500 hover:bg-red-600">
                            Disable
                          </button>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-md font-medium text-gray-900 truncate">
                            Wati Template 1
                          </p>
                          <button
                            onClick={() => setChangeTemplateOpen(true)}
                            className="rounded-md text-sm text-gray-400 hover:text-gray-500 truncate"
                          >
                            Change Template
                          </button>
                        </div>
                        <div>
                          <button className="inline-flex items-center shadow-sm px-2.5 py-0.5 text-sm leading-5 font-medium rounded-full text-white bg-green-500 hover:bg-green-600">
                            Activate
                          </button>
                        </div>
                      </div>
                    </li>
                    {/* ))} */}
                  </ul>
                </div>
              </div>
              <div className="flex flex-row justify-between px-4 py-4 sm:px-6">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Make Inactive
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
      />
    </div>
  );
};

SchedulerManagement.getLayout = LayoutSidebar;

export default SchedulerManagement;
