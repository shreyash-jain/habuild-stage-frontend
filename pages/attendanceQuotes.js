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

const AttendanceQuotes = (props) => {
  const columns = [
    {
      title: "Total Days Absent",
      dataIndex: "total_days_absent",
      key: "total_days_absent",
    },

    {
      title: "Total Days Present",
      dataIndex: "total_days_present",
      key: "total_days_present",
    },
    {
      title: "Day Presence",
      dataIndex: "day_presence",
      key: "phone",
    },
    {
      title: "Message",
      dataIndex: "mesage",
      key: "message",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
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
      <h1 className="text-2xl font-semibold text-gray-900">
        Attendance Quotes
      </h1>

      <Table
        onPaginationApi={() => {}}
        columns={columns}
        pagination
        dataSource={[{}]}
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

AttendanceQuotes.getLayout = LayoutSidebar;

export default AttendanceQuotes;
