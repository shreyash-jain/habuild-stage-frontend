import { useEffect, useState, Fragment } from "react";
import SidePannel from "../../components/SidePannel";
import DemoBatches from "./DemoBatches";
import ManageAds from "./ManageAds";

const tabs = [
  { name: "View/Manage Batches", current: true },
  { name: "View/Manage Ads", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ActionsSidePanel = (props) => {
  const [currentTab, setCurrentTab] = useState(props.initialTab);
  const [watiTemplates, setWatiTemplates] = useState([]);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [demoBatches, setDemoBatches] = useState([]);
  const [demoAds, setDemoAds] = useState([]);

  useEffect(() => {
    setCurrentTab(props.initialTab);
  }, [props.initialTab]);

  useEffect(() => {
    getDemoBatches();
    getDemoAds();
  }, [props.demoProgram]);

  // const fetchTemplates = async (calledFrom) => {
  //   await fetch("https://api.habuild.in/webhook/templates")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setWatiTemplates(data.data);
  //       if (calledFrom == "fromRefetch") {
  //         setRefetchLoading(false);
  //         toast.success("Wat templates updated.");
  //       }
  //     });
  // };

  // const refetchTemplates = async () => {
  //   setRefetchLoading(true);
  //   await fetch("https://api.habuild.in/webhook/templates_from_wati", {
  //     method: "PATCH",
  //   }).then((res) => {
  //     fetchTemplates("fromRefetch");
  //   });
  // };

  const getDemoBatches = async () => {
    await fetch(
      // `http://localhost:4000/api/demoprogram/demo_batches?id=${props.demoProgram.id}`
      `https://api.habuild.in/api/demoprogram/demo_batches?id=${props.demoProgram.id}`
    )
      // await fetch(`https://api.habuild.in/api/demoprogram/demo_batches`)
      .then((res) => res.json())
      .then((data) => {
        setDemoBatches(data.data);
      });
  };

  const getDemoAds = async () => {
    await fetch(
      // `https://api.habuild.in/api/demoprogram/ads/all?id=${props.demoProgram.id}`
      `https://api.habuild.in/api/demoprogram/ads/all?id=${props.demoProgram.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDemoAds(data.data);
      });
  };

  return (
    <SidePannel
      width="max-w-6xl"
      title={`${props.demoProgram?.name}`}
      isOpen={props.isOpen || false}
      setIsOpen={props.setIsOpen}
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

        {currentTab == "View/Manage Batches" && (
          <div className="rounded-md p-4 shadow-md mt-4">
            <DemoBatches
              getDemoBatches={getDemoBatches}
              demoBatches={demoBatches}
              demoProgram={props.demoProgram}
            />
          </div>
        )}

        {currentTab == "View/Manage Ads" && (
          <div className="rounded-md p-4 shadow-md mt-4">
            <ManageAds
              demoAds={demoAds}
              getDemoAds={getDemoAds}
              demoProgram={props.demoProgram}
            />
          </div>
        )}
      </div>
    </SidePannel>
  );
};

export default ActionsSidePanel;
