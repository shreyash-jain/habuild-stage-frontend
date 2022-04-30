import { useEffect, useState, Fragment } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";
import Modal from "../../components/Modal";
import FancySelect from "../../components/FancySelect";
import SidePannel from "../../components/SidePannel";
import {
  MenuAlt1Icon,
  RefreshIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import Select from "react-select";
import SendWAModal from "./SendWAModal";
import StopWACommModal from "./StopWACommModal";

const tabs = [
  { name: "Send WA Message", current: true },
  { name: "Start/Stop WA Communication", current: false },
  { name: "View Attendance", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MenuSidePanel = (props) => {
  const [currentTab, setCurrentTab] = useState("Send WA Message");
  const [watiTemplates, setWatiTemplates] = useState([]);
  const [refetchLoading, setRefetchLoading] = useState(false);

  const [demoPrograms, setDemoPrograms] = useState([]);

  useEffect(() => {
    fetchTemplates();
    getAllDemoPrograms();
  }, []);

  const withDemoBatches = (demoPrograms) => {
    const demoProgramsWithDemoBatches = demoPrograms.map(async (item) => {
      const demobatches = await fetch(
        `http://localhost:4000/api/demoprogram/demo_batches?id=${item.id}`
      )
        // await fetch(`https://api.habuild.in/api/demoprogram/demo_batches`)
        .then((res) => res.json())
        .then((data) => {
          return data.data;
        });

      return {
        ...item,
        action: item,
        demobatches,
      };
    });

    Promise.all(demoProgramsWithDemoBatches).then((data) =>
      setDemoPrograms(data)
    );
  };

  const getAllDemoPrograms = async () => {
    // await fetch(`https://api.habuild.in/api/demoprogram/?page=1&limit=10`)
    const demoPrograms = await fetch(
      `http://localhost:4000/api/demoprogram/?page=1&limit=10`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log("DATAAAA", data.data);
        // withDemoBatches(data.data);
        return data.data;
      });

    console.log("DEmo Programs!", demoPrograms);

    withDemoBatches(demoPrograms);
  };

  const fetchTemplates = async (calledFrom) => {
    await fetch("https://api.habuild.in/webhook/templates")
      .then((res) => res.json())
      .then((data) => {
        setWatiTemplates(data.data);
        if (calledFrom == "fromRefetch") {
          setRefetchLoading(false);
          toast.success("Wat templates updated.");
        }
      });
  };

  const refetchTemplates = async () => {
    setRefetchLoading(true);
    await fetch("https://api.habuild.in/webhook/templates_from_wati", {
      method: "PATCH",
    }).then((res) => {
      fetchTemplates("fromRefetch");
    });
  };

  return (
    <SidePannel title="Manage" isOpen={props.open} setIsOpen={props.setOpen}>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                onClick={() => {
                  setCurrentTab(tab.name);
                }}
                key={tab.name}
                className={classNames(
                  currentTab == tab.name
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:text-gray-700",
                  "px-3 py-2 font-medium text-sm rounded-md"
                )}
                aria-current={currentTab == tab.name ? "page" : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {currentTab == "Start/Stop WA Communication" && (
          <StopWACommModal
            open={props.open}
            setOpen={props.setOpen}
            setSelectedLeads={props.setSelectedLeads}
            getPaginatedLeads={() =>
              props.getPaginatedLeads(props.currentPagePagination)
            }
            selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads.length}
          />
        )}

        {currentTab == "Send WA Message" && (
          <SendWAModal
            demoPrograms={demoPrograms}
            refetchTemplates={refetchTemplates}
            searchTerm={props.searchTerm}
            open={props.open}
            setOpen={props.setOpen}
            watiTemplates={watiTemplates}
            selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads.length}
            refetchLoading={refetchLoading}
          />
        )}

        {currentTab == "View Attendance" && (
          <ViewAttendance
            open={props.open}
            setOpen={props.setOpen}
            demoBatches={props.demoBatches}
          />
        )}
      </div>
    </SidePannel>
  );
};

const ViewAttendance = (props) => {
  const [selectedDemoBatch, setSelectedDemobatch] = useState("");
  const [daysAttended, setDaysAttended] = useState(0);

  const [apiLoading, setApiLoading] = useState(false);

  console.log(props.demoBatches);

  const daysNum = [1, 2, 3, 4, 5, 6];

  const onSearch = async () => {
    setApiLoading(true);

    await fetch(
      `https://api.habuild.in/api/member/attended/members?batch_id=${selectedDemoBatch}&day=${daysAttended}`
    )
      .then((res) => res.json())
      .then((data) => {
        setApiLoading(false);
        console.log("data Resp ", data);
      });
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Batch
        </label>
        <div className="mt-1">
          <Select
            isDisabled={apiLoading}
            placeholder="Select Batch..."
            onChange={(option) => {
              setSelectedDemobatch(option.value);
            }}
            options={props.demoBatches.map((item) => {
              return {
                value: item.id,
                label: item.name,
                obj: item,
              };
            })}
          ></Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Days Attended
        </label>
        <div className="mt-1">
          <Select
            isDisabled={apiLoading}
            placeholder="Select Days Attended..."
            onChange={(option) => {
              setDaysAttended(option.value);
            }}
            options={daysNum.map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
          ></Select>
        </div>
      </div>

      {apiLoading ? (
        <RefreshIcon className="text-green-300 animate-spin h-6 w-6 mx-auto" />
      ) : (
        <button onClick={onSearch}>Search</button>
      )}
    </div>
  );
};

export default MenuSidePanel;
