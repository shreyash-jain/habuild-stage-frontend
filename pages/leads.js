import { useEffect, useState } from "react";
import LayoutSidebar from "../components/LayoutSidebar";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";
import Modal from "../components/Modal";
import {
  RefreshIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";

const attendance = [
  {
    day: "Monday",
    attended: true,
  },
  {
    day: "Tuesday",
    attended: true,
  },
  {
    day: "Wednesday",
    attended: true,
  },
  {
    day: "Thursday",
    attended: true,
  },
  {
    day: "Friday",
    attended: true,
  },
  {
    day: "Saturday",
    attended: false,
  },
];

const Leads = (props) => {
  const [viewPaymentModal, setViewPaymentModal] = useState(false);
  const [viewCommsModal, setViewCommsModal] = useState(false);
  const [viewAttendanceModal, setViewAttendanceModal] = useState(false);

  const [leads, setLeads] = useState([]);

  const [selectedLeads, setSelectedLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    getPaginatedLeads(1);
  }, []);

  const getPaginatedLeads = async (pageNum) => {
    setLoading(true);

    await fetch(`https://api.habuild.in/api/lead/?page=${pageNum}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        const leads = [];

        for (let i = 0; i < data.leads.length; i++) {
          leads.push({
            name: data.leads[i].name,
            status: data.leads[i].status,
            email: data.leads[i].email,
            mode: data.leads[i].mode,
            phone: data.leads[i].mobile_number,
            leadTime: format(parseISO(data.leads[i].lead_time), "PP"),
            isSelected: {
              identifier: data.leads[i].mobile_number,
              value: false,
            },
          });
        }

        setLeads(leads);
        setLoading(false);
      });
  };

  const menuItems = [
    {
      name: "Add Payment",
      onClick: () => {
        setViewPaymentModal(!viewPaymentModal);
      },
    },
    {
      name: "View Comms",
      onClick: () => {
        setViewCommsModal(!viewCommsModal);
      },
    },
    // {
    //   name: "View Attendance",
    //   onClick: () => {
    //     setViewAttendanceModal(!viewAttendanceModal);
    //   },
    // },
  ];

  const handleSelectAll = (checked) => {
    const newLeads = [...leads];
    const newSelectedLeads = [];

    for (let i = 0; i < newLeads.length; i++) {
      if (checked) {
        newSelectedLeads.push(newLeads[i].name);
        newLeads[i].isSelected.value = true;
      } else {
        newLeads[i].isSelected.value = false;
      }
    }

    if (!checked) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(newSelectedLeads);
    }

    setLeads(newLeads);
  };

  const handleSelect = (identifier) => {
    const newLeads = [...leads];
    const newSelectedLeads = [...selectedLeads];

    newLeads.find((item) => {});

    // for (let i = 0; i < newLeads.length; i++) {
    //   if (checked) {
    //     newLeads[i].isSelected.value = true;
    //   } else {
    //     newLeads[i].isSelected.value = false;
    //   }
    // }

    setLeads(newLeads);
  };

  const columns = [
    {
      title: "",
      dataIndex: "isSelected",
      key: "isSelected",
      renderHeader: true,
      headerRender: () => {
        return (
          <input
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="mt-1 h-4 w-4 rounded-md border-gray-300 "
            type="checkbox"
          />
        );
      },
      render: (isSelected) => {
        return (
          <input
            onChange={(e) => handleSelect(isSelected.identifier)}
            className="mt-1 h-4 w-4 rounded-md border-gray-300 "
            type="checkbox"
            checked={isSelected.value}
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      render: () => {
        return (
          <div className="flex relative z-0 overflow-hidden">
            {attendance.map((item) => {
              if (item.attended) {
                return (
                  <span title={item.day}>
                    <CheckCircleIcon className="text-green-400 h-6" />
                  </span>
                );
              } else {
                return (
                  <span title={item.day}>
                    <XCircleIcon className="text-red-400 h-6" />
                  </span>
                );
              }
            })}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        if (!data) {
          return <></>;
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-300 text-green-800">
            {data}
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Lead Time",
      dataIndex: "leadTime",
      key: "leadTime",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (profile) => {
        return <FlyoutMenu menuItems={menuItems}></FlyoutMenu>;
      },
    },
  ];

  if (loading) {
    return (
      <div
        style={{ height: "100vh", width: "100%" }}
        className="flex items-center"
      >
        <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>

      <Table
        handlePaginationClick={getPaginatedLeads}
        columns={columns}
        pagination
        dataSource={leads}
      />

      <AddPaymentModal
        viewPaymentModal={viewPaymentModal}
        setViewPaymentModal={setViewPaymentModal}
      />

      <CommsModal
        viewCommsModal={viewCommsModal}
        setViewCommsModal={setViewCommsModal}
      />

      {/* <AttendanceModal
        viewAttendanceModal={viewAttendanceModal}
        setViewAttendanceModal={setViewAttendanceModal}
      /> */}
    </div>
  );
};

const AddPaymentModal = (props) => {
  return (
    <Modal
      modalOpen={props.viewPaymentModal}
      setModalOpen={props.setViewPaymentModal}
      actionText="Add Payment"
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add payment Details
        </h2>

        <div>
          <label
            htmlFor="first-name"
            className="block text-md font-medium text-gray-700"
          >
            Mode
          </label>

          <select className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md">
            <option></option>
            <option value="volvo">Volvo</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="first-name"
            className="block text-md font-medium text-gray-700"
          >
            Unique Transaction Id
          </label>
          <input
            type="text"
            name="first-name"
            id="first-name"
            autoComplete="given-name"
            className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="first-name"
            className="block text-md font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            name="first-name"
            id="first-name"
            autoComplete="given-name"
            className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
          />
        </div>
      </div>
    </Modal>
  );
};

const CommsModal = (props) => {
  const columns = [
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
  ];

  return (
    <Modal
      modalOpen={props.viewCommsModal}
      setModalOpen={props.setViewCommsModal}
      hideActionButtons
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-left text-xl font-bold text-gray-900">
          Communications
        </h2>

        <Table
          columns={columns}
          pagination={false}
          dataSource={[
            {
              mode: "Whatsapp",
              message: "Yoo",
              destination: "123456",
              time: "5 minutes ago",
            },
          ]}
        />
      </div>
    </Modal>
  );
};

const AttendanceModal = (props) => {
  const columns = [
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Absence",
      dataIndex: "absence",
      key: "absence",
    },
  ];

  return (
    <Modal
      modalOpen={props.viewAttendanceModal}
      setModalOpen={props.setViewAttendanceModal}
      hideActionButtons
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-left text-xl font-bold text-gray-900">
          Attendance
        </h2>

        <Table
          columns={columns}
          dataSource={[
            {
              mode: "Day 1, Monday",
              absence: "Yes",
            },
          ]}
        />
      </div>
    </Modal>
  );
};

Leads.getLayout = LayoutSidebar;

export default Leads;
