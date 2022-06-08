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
import StopMembershipModal from "./StopMembershipModal";

const tabs = [
  // { name: "Send WA Message", current: true },
  { name: "Start/Stop Membership", current: true },
  // { name: "View Attendance", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MenuSidePanel = (props) => {
  const [currentTab, setCurrentTab] = useState("Start/Stop Membership");
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
        // `http://localhost:4000/api/demoprogram/demo_batches?id=${item.id}`
        `https://api.habuild.in/api/demoprogram/demo_batches?id=${item.id}`
      )
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
    const demoPrograms = await fetch(
      // `http://localhost:4000/api/demoprogram/?page=1&limit=10`
      `https://api.habuild.in/api/demoprogram/?page=1&limit=10`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log("DATAAAA", data.data);
        // withDemoBatches(data.data);
        return data.data;
      });

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
    <SidePannel
      title="Manage"
      isOpen={props.open || false}
      setIsOpen={props.setOpen}
    >
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

        {currentTab == "Start/Stop Membership" && (
          <StopMembershipModal
            open={props.open}
            setOpen={props.setOpen}
            setSelectedLeads={props.setSelectedLeads}
            // getPaginatedLeads={() =>
            //   props.getPaginatedLeads(props.currentPagePagination)
            // }
            // selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads?.length}
          />
        )}
      </div>
    </SidePannel>
  );
};

export default MenuSidePanel;
