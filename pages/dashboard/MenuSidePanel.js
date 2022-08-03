import { useEffect, useState, Fragment } from "react";
import SidePannel from "../../components/SidePannel";

import ReRegisterBatch from "./ReRigesterbatch";

const tabs = [{ name: "Re-Register Batch", current: true }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MenuSidePanel = (props) => {
  const [currentTab, setCurrentTab] = useState("Re-Register Batch");
  const [watiTemplates, setWatiTemplates] = useState([]);
  const [refetchLoading, setRefetchLoading] = useState(false);

  const [demoPrograms, setDemoPrograms] = useState([]);

  return (
    <SidePannel
      title="Dashboard Menu"
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
      </div>

      <ReRegisterBatch
        customFetch={props.customFetch}
        memberProgramsWithBatches={props.memberProgramsWithBatches}
      />
    </SidePannel>
  );
};

export default MenuSidePanel;
