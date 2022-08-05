import { useEffect, useState, Fragment } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";
import {
  DailyQuotesApis,
  DemoBatchesApis,
  ProgramsApis,
} from "../../constants/apis";
import AddDailyQuoteModal from "./AddDailyQuoteModal";
import EditEverydayQuote from "./EditEverydayQuote";
import { RefreshIcon } from "@heroicons/react/outline";
import useCheckAuth from "../../hooks/useCheckAuth";
import { useFetchWrapper } from "../../utils/apiCall";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "EveryDay Quotes", href: "#", current: false },
  { name: "Morning Quotes", href: "#", current: false },
];

const DailyQuotes = (props) => {
  // const checkAuthLoading = useCheckAuth(false);
  const checkAuthLoading = false;


  const { customFetch } = useFetchWrapper();

  const [dailyQuotes, setDailyQuotes] = useState([]);
  const [memberDailyQuotes, setMemberDailyQuotes] = useState([]);
  const [leadDailyQuotes, setLeadDailyQuotes] = useState([]);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);
  const [viewEditEverydayQuoteModal, setViewEditEverydayQuoteModal] =
    useState(false);

  const [demoBatches, setDemoBatches] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [editQuote, setEditQuote] = useState({});

  const [enabled, setEnabled] = useState(true);
  const [currentMemberTab, setCurrentMemberTab] = useState("EveryDay Quotes");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkAuthLoading) {
      getDailyQuotes();

      getAllPrograms();
      getDemoBatches();
    }
  }, [checkAuthLoading]);

  const getDailyQuotes = async () => {
    setLoading(true);
    const data = await customFetch(DailyQuotesApis.GET(), "GET", {});
    // console.log(data);
    setDailyQuotes(
      data.dailyQuotes.map((item) => {
        return {
          ...item,
          action: item,
        };
      })
    );

    let filteredMemberQuotes = data.dailyQuotes.filter((item) => {
      if (item.type == "MEMBER") {
        return item;
      }
    });

    filteredMemberQuotes = filteredMemberQuotes.sort(
      (a, b) => a.day_id - b.day_id
    );

    // console.log("FilteredMemberQuotes", filteredMemberQuotes);

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
        return item;
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

  const menuItems = [
    {
      name: "Edit",
      onClick: (actionEntity) => {
        setEditQuote(actionEntity);
        if (
          (currentMemberTab == "EveryDay Quotes" ||
            currentMemberTab == "Morning Quotes") &&
          enabled
        ) {
          setViewEditEverydayQuoteModal(true);
        } else {
          setViewEditModal(true);
        }
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

  const memberQuotesColumns = [
    {
      title: "DayQuote",
      dataIndex: "day_id",
      key: "day_id",
    },
    currentMemberTab == "EveryDay Quotes"
      ? {
          title: "Quote",
          dataIndex: "action",
          key: "action",
          render: (actionEntity) => {
            return (
              <div className="flex flex-col space-y-2">
                <p>{actionEntity?.quote_1}</p>
                <p>{actionEntity?.quote_2}</p>
                <p>{actionEntity?.quote_3}</p>
              </div>
            );
          },
        }
      : {
          title: "Morning Message",
          dataIndex: "action",
          key: "action",
          render: (actionEntity) => {
            return (
              <div className="flex flex-col space-y-2">
                <p>{actionEntity?.morning_message}</p>
              </div>
            );
          },
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

  const handleTabChange = (newTab) => {
    setCurrentMemberTab(newTab);
  };

  if (checkAuthLoading) {
    return <RefreshIcon className="text-green-300 h-8 w-8 mx-auto" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Daily Quotes
      </h1>

      <div className="flex flex-row space-x-2 justify-left">
        <button
          className={`font-medium px-4 py-2 rounded-md -z-1 ${
            enabled
              ? "bg-green-300 text-green-700"
              : "bg-red-300 text-red-700  opacity-50 hover:opacity-100"
          }`}
          onClick={() => {
            setEnabled(!enabled);
          }}
          disabled={enabled}
        >
          {enabled ? "" : "Show"} Member Quotes
        </button>

        <button
          className={`font-medium px-4 py-2 rounded-md -z-1 ${
            enabled
              ? "bg-red-300 text-red-700 opacity-50 hover:opacity-100"
              : "bg-green-300 text-green-700"
          }`}
          onClick={() => {
            setEnabled(!enabled);
          }}
          disabled={!enabled}
        >
          {enabled ? "Show" : ""} Lead Quotes
        </button>
      </div>

      {enabled && (
        <div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  onClick={() => handleTabChange(tab.name)}
                  key={tab.name}
                  href={tab.href}
                  className={`
                  ${
                    currentMemberTab == tab.name
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {loading ? (
        <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
      ) : (
        <Table
          onPaginationApi={() => {}}
          columns={enabled ? memberQuotesColumns : columns}
          pagination
          dataSource={enabled ? memberDailyQuotes : leadDailyQuotes}
        />
      )}

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Daily Quote +
      </button>

      <AddDailyQuoteModal
        demoBatches={demoBatches}
        programs={programs}
        getQuotes={getDailyQuotes}
        viewModal={viewAddModal}
        setViewModal={setViewAddModal}
        leastDayNum={memberDailyQuotes.length}
        customFetch={customFetch}
      />

      <AddDailyQuoteModal
        editQuote={editQuote}
        demoBatches={demoBatches}
        programs={programs}
        getQuotes={getDailyQuotes}
        viewModal={viewEditModal}
        setViewModal={setViewEditModal}
        mode="edit"
        customFetch={customFetch}
      />

      <EditEverydayQuote
        // calledFrom={() => {
        //   if (currentMemberTab == "Morning Quotes") {
        //     return "morningTab";
        //   } else {
        //     return "everydayTab";
        //   }
        // }}
        currentMemberTab={currentMemberTab}
        editQuote={editQuote}
        getQuotes={getDailyQuotes}
        viewModal={viewEditEverydayQuoteModal}
        setViewModal={setViewEditEverydayQuoteModal}
        customFetch={customFetch}
      />
    </div>
  );
};

DailyQuotes.getLayout = LayoutSidebar;

export default DailyQuotes;
