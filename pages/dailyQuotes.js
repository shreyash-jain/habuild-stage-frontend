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
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

const DailyQuotes = (props) => {
  const [dailyQuotes, setDailyQuotes] = useState([]);

  useEffect(() => {
    getDailyQuotes();
  }, []);

  const getDailyQuotes = async () => {
    await fetch("https://api.habuild.in/api/daily_quote/all_daily_quotes")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setDailyQuotes(data.dailyQuotes);
      });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Highlight",
      dataIndex: "highlight",
      key: "highlight",
    },
    {
      title: "Highlight_2",
      dataIndex: "highlight_2",
      key: "highlight_2",
    },
    {
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
      render: (lead) => {
        return <FlyoutMenu menuItems={[]}></FlyoutMenu>;
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Daily Quotes</h1>

      <Table
        onPaginationApi={() => {}}
        columns={columns}
        pagination
        dataSource={dailyQuotes}
      />

      {/* <button
        // onClick={() => setViewAddLeadModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Member +
      </button> */}
    </div>
  );
};

DailyQuotes.getLayout = LayoutSidebar;

export default DailyQuotes;
