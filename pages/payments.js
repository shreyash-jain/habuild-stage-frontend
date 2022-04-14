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

const Payments = (props) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
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
      <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>

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

Payments.getLayout = LayoutSidebar;

export default Payments;
