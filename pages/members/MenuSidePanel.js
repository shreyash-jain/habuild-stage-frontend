import { useEffect, useState, Fragment } from "react";
import SidePannel from "../../components/SidePannel";
import toast from "react-hot-toast";
import StopWACommMember from "./StopWACommMember";
import MemberSendWAModal from "./MemberSendWAModal";
import MemberCSVUpload from "./MemberCSVUpload";
import { DemoProgramsApis, WatiTemplatesApis } from "../../constants/apis";
import BatchUpdateCurrentChannel from "./BatchUpdateCurrentChannel";

const tabs = [
  { name: "Update Current Channel", current: true },
  { name: "Send WA Message", current: false },
  { name: "Start/Stop WA Communication", current: false },
  { name: "CSV Data Upload", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MenuSidePanel = (props) => {
  const [currentTab, setCurrentTab] = useState("Update Current Channel");
  const [watiTemplates, setWatiTemplates] = useState([]);
  const [refetchLoading, setRefetchLoading] = useState(false);

  const [demoPrograms, setDemoPrograms] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async (calledFrom) => {
    const data = await props.customFetch(WatiTemplatesApis.GET(), "GET", {});
    setWatiTemplates(data.data);
    if (calledFrom == "fromRefetch") {
      setRefetchLoading(false);
      toast.success("Wat templates updated.");
    }
  };

  const refetchTemplates = async () => {
    setRefetchLoading(true);
    await props.customFetch(WatiTemplatesApis.REFETCH(), "PATCH", {});
    fetchTemplates("fromRefetch");
  };

  return (
    <SidePannel
      width="max-w-3xl"
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

        {currentTab == "Start/Stop WA Communication" && (
          <StopWACommMember
            open={props.open}
            setOpen={props.setOpen}
            setSelectedLeads={props.setSelectedLeads}
            getPaginatedLeads={() =>
              props.getPaginatedLeads(props.currentPagePagination)
            }
            selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads?.length}
            customFetch={props.customFetch}
          />
        )}

        {currentTab == "Send WA Message" && (
          <MemberSendWAModal
            open={props.open}
            setOpen={props.setOpen}
            setSelectedLeads={props.setSelectedLeads}
            getPaginatedLeads={() =>
              props.getPaginatedLeads(props.currentPagePagination)
            }
            selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads?.length}
            memberProgramsWithBatches={props.memberProgramsWithBatches}
            watiTemplates={watiTemplates}
            refetchTemplates={refetchTemplates}
            customFetch={props.customFetch}
          />
        )}

        {currentTab == "CSV Data Upload" && (
          <MemberCSVUpload customFetchFile={props.customFetchFile} />
        )}

        {currentTab == "Update Current Channel" && (
          <BatchUpdateCurrentChannel
            customFetch={props.customFetch}
            memberProgramsWithBatches={props.memberProgramsWithBatches}
            getPaginatedLeads={() =>
              props.getPaginatedLeads(props.currentPagePagination)
            }
          />
        )}
      </div>
    </SidePannel>
  );
};

export default MenuSidePanel;
