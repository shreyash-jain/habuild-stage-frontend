import { useEffect, useState } from "react";
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
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

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
  {
    day: "Sunday",
    attended: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Leads = (props) => {
  const [viewPaymentModal, setViewPaymentModal] = useState(false);
  const [viewCommsModal, setViewCommsModal] = useState(false);
  const [viewSendWAModal, setViewSendWAModal] = useState(false);
  const [viewStopWACommModal, setViewStopWACommModal] = useState(false);
  const [viewAddLeadModal, setViewAddLeadModal] = useState(false);

  const [leads, setLeads] = useState([]);

  const [selectedLeads, setSelectedLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedBatch, setSelectedBatch] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [demoBatches, setDemoBatches] = useState([
    { name: "Batch 1" },
    { name: "Batch 2" },
    { name: "BAtch 3" },
  ]);

  useEffect(async () => {
    getPaginatedLeads(1);
    getDemobatches();
  }, []);

  const getDemobatches = async () => {
    await fetch(`https://api.habuild.in/api/demobatches/`)
      .then((res) => res.json())
      .then((data) => {
        setDemoBatches(data.demoBatches);
      });
  };

  const getPaginatedLeads = async (pageNum) => {
    setLoading(true);

    await fetch(`https://api.habuild.in/api/lead/?page=${pageNum}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const leads = [];

        for (let i = 0; i < data.leads.leadDataArr.length; i++) {
          leads.push({
            name: data.leads.leadDataArr[i].name,
            status: data.leads.leadDataArr[i].status,
            email: data.leads.leadDataArr[i].email,
            source: data.leads.leadDataArr[i].source,
            phone: data.leads.leadDataArr[i].mobile_number,
            leadTime: format(
              parseISO(data.leads.leadDataArr[i].lead_time),
              "PP"
            ),
            isSelected: {
              identifier: data.leads.leadDataArr[i].name,
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
    const newSelectedLeads = [...selectedLeads];
    const newLeads = [...leads];
    const index = newSelectedLeads.indexOf(identifier);

    for (let i = 0; i < newLeads.length; i++) {
      if (newLeads[i].name === identifier) {
        if (newLeads[i].isSelected.value == true) {
          if (index > -1) {
            newSelectedLeads.splice(index, 1);
          }

          newLeads[i].isSelected.value = false;
        } else {
          newSelectedLeads.push(identifier);
          newLeads[i].isSelected.value = true;
        }
      }
    }

    setLeads(newLeads);
    setSelectedLeads(newSelectedLeads);
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
      renderHeader: true,
      headerRender: () => {},
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
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

  const handleSearch = () => {
    setLoading(true);
    if (!searchTerm) {
      return;
    }

    fetch(`https://api.habuild.in/api/lead/find/${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          toast.error(data.message);
          setLoading(false);
          return;
        }

        setLeads([
          {
            name: data.name,
            status: data.status,
            email: data.email,
            source: data.source,
            phone: data.mobile_number,
            leadTime: format(parseISO(data.lead_time || data.created_at), "PP"),
            isSelected: {
              identifier: data.name,
              value: false,
            },
          },
        ]);
        setLoading(false);
      });
  };

  const handleSearchCancel = () => {
    setSearchTerm("");
    getPaginatedLeads(1);
  };

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

      <div className="min-w-0 flex-1 md:px-4 lg:px-0 xl:col-span-6">
        <div className="flex items-center py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="search"
                name="search"
                className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search Lead by Phone number, name or email."
                type="search"
              />
            </div>
            {searchTerm && (
              <>
                <button
                  onClick={handleSearch}
                  className="font-medium px-4 py-2 rounded-md bg-white border-2 border-green-400 hover:bg-green-400 text-green-700 hover:text-white mt-2"
                >
                  Search
                </button>
                <button
                  onClick={handleSearchCancel}
                  className="ml-2 font-medium px-4 py-2 rounded-md bg-white border-2 border-red-400 hover:bg-red-400 text-red-700 hover:text-white mt-2"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full mt-8 justify-between">
        <Menu as="div" className="relative z-10 inline-block text-left">
          <div>
            <Menu.Button className="group inline-flex justify-center text-lg font-medium text-gray-700 hover:text-gray-900">
              Batch -{" "}
              <span className="text-green-600 ml-2">{selectedBatch}</span>
              <ChevronDownIcon
                className="flex-shrink-0 mt-1 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedBatch("All")}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm font-medium text-gray-900 w-full"
                      )}
                    >
                      All
                    </button>
                  )}
                </Menu.Item>
                {demoBatches.map((option) => (
                  <Menu.Item key={option.id}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedBatch(option.name)}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm font-medium text-gray-900 w-full"
                        )}
                      >
                        {option.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <div className="flex-end space-x-2">
          <button
            onClick={() => setViewSendWAModal(true)}
            className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white "
          >
            Send WA Message
          </button>
          <button
            onClick={() => setViewStopWACommModal(true)}
            className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white"
          >
            Stop WA Communication
          </button>
        </div>
      </div>

      <Table
        handlePaginationClick={getPaginatedLeads}
        columns={columns}
        pagination
        dataSource={leads}
      />

      <button
        onClick={() => setViewAddLeadModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Lead +
      </button>

      <AddPaymentModal
        viewPaymentModal={viewPaymentModal}
        setViewPaymentModal={setViewPaymentModal}
      />

      <CommsModal
        viewCommsModal={viewCommsModal}
        setViewCommsModal={setViewCommsModal}
      />

      <AddLeadModal
        viewAddLeadModal={viewAddLeadModal}
        setViewAddLeadModal={setViewAddLeadModal}
      />

      <SendWAModal
        viewSendWAModal={viewSendWAModal}
        setViewSendWAModal={setViewSendWAModal}
        selectedLeadsLength={selectedLeads.length}
      />

      <StopWACommModal
        viewStopWACommModal={viewStopWACommModal}
        setViewStopWACommModal={setViewStopWACommModal}
        selectedLeadsLength={selectedLeads.length}
      />

      {/* <AttendanceModal
        viewAttendanceModal={viewAttendanceModal}
        setViewAttendanceModal={setViewAttendanceModal}
      /> */}
    </div>
  );
};

const SendWAModal = (props) => {
  return (
    <Modal
      modalOpen={props.viewSendWAModal}
      setModalOpen={props.setViewSendWAModal}
      actionText="Send"
    >
      <div className="flex flex-col space-y-4">
        <div>{props.selectedLeadsLength} people selected</div>

        <div>
          <label
            htmlFor="first-name"
            className="block text-md font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            rows={4}
            name="message"
            id="message"
            autoComplete="message"
            className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
          />
        </div>
      </div>
    </Modal>
  );
};

const StopWACommModal = (props) => {
  return (
    <Modal
      modalOpen={props.viewStopWACommModal}
      setModalOpen={props.setViewStopWACommModal}
      actionText="Stop"
    >
      <div className="flex flex-col space-y-4">
        <div>{props.selectedLeadsLength} people selected</div>
      </div>
    </Modal>
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

const AddLeadModal = (props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!name || !phone || !email) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      name,
      email,
      mobile_number: phone,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("https://api.habuild.in/api/lead?action_point=crm", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setApiLoading(false);
        toast.success("Lead Created");
        console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        toast.error("No lead created");
        console.log("error", error);
      });
  };

  return (
    <Modal
      modalOpen={props.viewAddLeadModal}
      setModalOpen={props.setViewAddLeadModal}
      actionText="Add Lead"
      hideActionButtons
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add payment Details
        </h2>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            placeholder="Name"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            required
            pattern="^[0-9]{10}$"
            placeholder="Your WhatsApp Phone no. (10 digits)"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Your E-mail"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          type="submit"
        >
          Add Lead
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

Leads.getLayout = LayoutSidebar;

export default Leads;
