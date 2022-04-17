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
import FancySelect from "../components/FancySelect";
import SidePannel from "../components/SidePannel";
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

const filters = {
  status: [
    // { value: "lead", label: "Lead", checked: false },
    // { value: "prelead", label: "Pre-Lead", checked: false },
    // { value: "converted", label: "Converted", checked: false },
  ],
  leadDate: [
    { value: "asc", label: "Ascending", checked: false },
    { value: "desc", label: "Descending", checked: false },
  ],
  source: [
    { value: "facebook", label: "Facebook", checked: false },
    { value: "googleads", label: "Google Leads", checked: true },
    { value: "crm", label: "CRM", checked: false },
    { value: "landing", label: "Landing Page", checked: false },
  ],
  paid: [
    { value: "yes", label: "Yes", checked: false },
    { value: "no", label: "No", checked: false },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Leads = (props) => {
  const [viewPaymentModal, setViewPaymentModal] = useState(false);
  const [viewCommsModal, setViewCommsModal] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [viewSendWAModal, setViewSendWAModal] = useState(false);
  const [viewStopWACommModal, setViewStopWACommModal] = useState(false);
  const [viewAddLeadModal, setViewAddLeadModal] = useState(false);
  const [viewAddCommModal, setViewAddCommModal] = useState(false);
  const [viewFilterModal, setViewFilterModal] = useState(false);

  const [leads, setLeads] = useState([]);

  const [selectedLeads, setSelectedLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedBatch, setSelectedBatch] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [demoBatches, setDemoBatches] = useState([]);

  const [filterParams, setFilterParams] = useState({});

  const [leadForAction, setLeadForAction] = useState({});

  const [totalRecords, setTotalRecords] = useState(100);
  const [currentPagePagination, setCurrentPagePagination] = useState(1);

  const [memberComms, setMemberComms] = useState([]);

  useEffect(() => {
    getPaginatedLeads(1);
    getDemobatches();
  }, []);

  const getDemobatches = async () => {
    await fetch(`https://api.habuild.in/api/demobatches/`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Demo Batches", data.demoBatches);
        setDemoBatches(data.demoBatches);
      });
  };

  const getPaginatedLeads = async (pageNum) => {
    setLoading(true);
    setCurrentPagePagination(pageNum);
    // console.log("Page Num!!!!", pageNum);

    let api = `https://api.habuild.in/api/lead/?page=${pageNum}&limit=100`;
    // let api = `http://localhost:4000/api/lead/?page=${pageNum}&limit=100`;

    if (Object.keys(filterParams).length > 0) {
      for (var i = 0; i < Object.keys(filterParams).length; i++) {
        api =
          api +
          `&${Object.keys(filterParams)[i]}=${
            filterParams[Object.keys(filterParams)[i]]
          }`;
      }
    }

    // console.log("API", api);

    await fetch(api)
      .then((res) => {
        if (!res) {
          throw Error("No Response from Server");
        }
        return res.json();
      })
      .then((data) => {
        // console.log("DATA", data);
        const leads = [];

        for (let i = 0; i < data.leads.leadDataArr.length; i++) {
          leads.push({
            member_id: data.leads.leadDataArr[i].member_id,
            name: data.leads.leadDataArr[i].name,
            status: data.leads.leadDataArr[i].status,
            email: data.leads.leadDataArr[i].email,
            source: data.leads.leadDataArr[i].source,
            phone: data.leads.leadDataArr[i].mobile_number,
            leadTime: format(
              parseISO(data.leads.leadDataArr[i].lead_time),
              "PPpp"
            ),
            isSelected: {
              identifier: data.leads.leadDataArr[i].member_id,
              value: false,
            },
            action: data.leads.leadDataArr[i],
            wa_comm_status: data.leads.leadDataArr[i].wa_comm_status,
          });
        }

        setTotalRecords(data.leads.totalLeadsSize);
        setLeads(leads);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Error, please try refreshing.");
        // toast.error(err);
        setLeads([]);
        setLoading(false);
      });
  };

  const menuItems = [
    {
      name: "Add Payment",
      onClick: (actionEntity) => {
        setLeadForAction(actionEntity);
        setViewPaymentModal(!viewPaymentModal);
      },
    },
    {
      name: "View Comms",
      onClick: (actionEntity) => {
        getComms(actionEntity);
      },
    },
    {
      name: "Add Comms",
      onClick: (actionEntity) => {
        setLeadForAction(actionEntity);
        setViewAddCommModal(!viewAddCommModal);
      },
    },
    // {
    //   name: "View Attendance",
    //   onClick: () => {
    //     setViewAttendanceModal(!viewAttendanceModal);
    //   },
    // },
  ];

  const getComms = async (actionEntity) => {
    setLeadForAction(actionEntity);

    const idToUse = actionEntity.member_id || actionEntity.id;
    // await fetch(
    //   `http://localhost:4000/api/member/getCommunicationLogs/${idToUse}`
    // )
    await fetch(
      `https://api.habuild.in/api/member/getCommunicationLogs/${idToUse}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMemberComms(data);
        setViewCommsModal(true);
      });
  };

  const handleSelectAll = (checked) => {
    const newLeads = [...leads];
    const newSelectedLeads = [];

    for (let i = 0; i < newLeads.length; i++) {
      if (checked) {
        newSelectedLeads.push(newLeads[i]);
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
    let newSelectedLeads = [...selectedLeads];
    const newLeads = [...leads];
    // const index = newSelectedLeads.indexOf(identifier);

    for (let i = 0; i < newLeads.length; i++) {
      if (newLeads[i].member_id === identifier) {
        if (newLeads[i].isSelected.value == true) {
          newSelectedLeads = newSelectedLeads.filter(
            (item) => item.member_id !== identifier
          );

          // if (i > -1) {
          //   newSelectedLeads.splice(i, 1);
          // }

          newLeads[i].isSelected.value = false;
        } else {
          newSelectedLeads.push(newLeads[i]);
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
      title: "Member ID",
      dataIndex: "member_id",
      key: "member_id",
    },
    {
      title: "WhatsApp Communication Status",
      dataIndex: "wa_comm_status",
      key: "wa_comm_status",
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      render: () => {
        return (
          <div className="flex relative -z-1 overflow-hidden">
            {attendance.map((item) => {
              if (item.attended) {
                return (
                  <span key={item.day} title={item.day}>
                    <CheckCircleIcon className="text-green-400 h-6" />
                  </span>
                );
              } else {
                return (
                  <span key={item.day} title={item.day}>
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
      render: (lead) => {
        return (
          <FlyoutMenu actionEntity={lead} menuItems={menuItems}></FlyoutMenu>
        );
      },
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    setSelectedLeads([]);
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

        console.log("Search Data", data);

        setLeads(
          data.data.map((item) => {
            return {
              member_id: item.id,
              name: item.name,
              status: item.status,
              email: item.email,
              source: item.source,
              phone: item.mobile_number,
              leadTime: format(
                parseISO(item.lead_time || item.created_at),
                "PPpp"
              ),
              isSelected: {
                identifier: item.id,
                value: false,
              },
              action: item,
              wa_comm_status: item.wa_comm_status,
            };
          })
        );
        setLoading(false);
      });
  };

  const handleSearchCancel = () => {
    setSearchTerm("");
    getPaginatedLeads(1);
  };

  // if (loading) {
  //   return (
  //     <div
  //       style={{ height: "100vh", width: "100%" }}
  //       className="flex items-center"
  //     >
  //       <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
  //     </div>
  //   );
  // }

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
                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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

      <button
        title="Refresh Leads"
        onClick={() => {
          setSearchTerm("");
          setFilterParams({});
          getPaginatedLeads(1);
        }}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white"
      >
        <RefreshIcon className="h-5 w-5" />
      </button>

      <button
        title="Filter Leads"
        onClick={() => setViewFilterModal(true)}
        className="ml-2 font-medium px-8 py-2 rounded-md bg-gray-300 hover:bg-gray-500 text-gray-700 hover:text-white"
      >
        <FilterIcon className="h-5 w-5" />
      </button>

      {Object.keys(filterParams).length > 0 && (
        <button
          title="Clear Filters"
          onClick={() => {
            setFilterParams({});
            getPaginatedLeads(1);
          }}
          className="ml-2   text-gray-500 hover:text-gray-900"
        >
          Clear Filters
        </button>
      )}

      <div className="flex flex-row w-full mt-8 justify-between">
        <div className="fixed right-8 flex-end space-x-2">
          {/* <button
            onClick={() => setViewSendWAModal(true)}
            className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white "
          >
            Send WA Message
          </button>
          <button
            onClick={() => setViewStopWACommModal(true)}
            className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white"
          >
            Start/Stop WA Communication
          </button> */}
        </div>
      </div>

      <Table
        dataLoading={loading}
        totalRecords={totalRecords}
        onPaginationApi={getPaginatedLeads}
        currentPagePagination={currentPagePagination}
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

      <button
        onClick={() => setShowMenuSidebar(true)}
        className="transition duration-300 font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-36"
      >
        <MenuAlt1Icon className="w-6 h-6" />
      </button>

      <AddPaymentModal
        leadForAction={leadForAction}
        viewPaymentModal={viewPaymentModal}
        setViewPaymentModal={setViewPaymentModal}
      />

      <CommsModal
        comms={memberComms}
        leadForAction={leadForAction}
        viewCommsModal={viewCommsModal}
        setViewCommsModal={setViewCommsModal}
      />

      <AddLeadModal
        getPaginatedLeads={getPaginatedLeads}
        viewAddLeadModal={viewAddLeadModal}
        setViewAddLeadModal={setViewAddLeadModal}
      />

      {/* <SendWAModal
        selectedLeads={selectedLeads}
        viewSendWAModal={viewSendWAModal}
        setViewSendWAModal={setViewSendWAModal}
        selectedLeadsLength={selectedLeads.length}
      /> */}

      <AddCommModal
        leadForAction={leadForAction}
        modalOpen={viewAddCommModal}
        setModalOpen={setViewAddCommModal}
      />

      {/* <AttendanceModal
        viewAttendanceModal={viewAttendanceModal}
        setViewAttendanceModal={setViewAttendanceModal}
      /> */}

      <MenuSidePanel
        searchTerm={searchTerm}
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getPaginatedLeads}
        selectedLeads={selectedLeads}
        setSelectedLeads={setSelectedLeads}
        open={showMenuSidebar}
        setOpen={setShowMenuSidebar}
      />

      <FiltersModal
        setSelectedLeads={setSelectedLeads}
        getPaginatedLeads={getPaginatedLeads}
        demoBatches={demoBatches}
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        modalOpen={viewFilterModal}
        setModalOpen={setViewFilterModal}
      />
    </div>
  );
};

const tabs = [
  { name: "Send WA Message", current: true },
  { name: "Start/Stop WA Communication", current: false },
];

const MenuSidePanel = (props) => {
  const [currentTab, setCurrentTab] = useState("Send WA Message");
  const [watiTemplates, setWatiTemplates] = useState([]);

  useEffect(async () => {
    // if (!props.selectedLeads.length > 0) {
    //   setApiLoading(false);
    //   props.setViewSendWAModal(false);
    //   toast.error("No Lead selected.");
    //   return;
    // }

    await fetch("https://api.habuild.in/webhook/templates")
      .then((res) => res.json())
      .then((data) => {
        setWatiTemplates(data.data);
      });
  }, []);

  return (
    <SidePannel title="Manage" isOpen={props.open} setIsOpen={props.setOpen}>
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
          <StopWACommModal
            open={props.open}
            setOpen={props.setOpen}
            setSelectedLeads={props.setSelectedLeads}
            getPaginatedLeads={() =>
              props.getPaginatedLeads(props.currentPagePagination)
            }
            selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads.length}
          />
        )}

        {currentTab == "Send WA Message" && (
          <SendWAModal
            searchTerm={props.searchTerm}
            open={props.open}
            setOpen={props.setOpen}
            watiTemplates={watiTemplates}
            selectedLeads={props.selectedLeads}
            selectedLeadsLength={props.selectedLeads.length}
          />
        )}
      </div>
    </SidePannel>
  );
};

const AddCommModal = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("Phone");
  const [apiLoading, setApiLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!props.leadForAction) {
      toast.error("Error!");
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      member_id: props.leadForAction.member_id || props.leadForAction.id,
      date: new Date(),
      status: "success",
      type: "lead_query",
      mode,
      name,
      description,
      source: "crm",
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // console.log(requestOptions);
    fetch("https://api.habuild.in/api/lead/communication", requestOptions)
      // fetch("http://localhost:4000/api/lead/communication", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setApiLoading(false);
        setName("");
        setDescription("");
        setMode("Phone");
        props.setModalOpen(false);
        toast.success("Communication Log Created");
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        console.log("error", error);
      });
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      actionText="Add"
      hideActionButtons
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add Communication Details
        </h2>

        <form
          className="flex flex-col w-full space-y-5"
          onSubmit={(e) => {
            formSubmit(e);
          }}
        >
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Agent Name
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

          <div>
            <label
              htmlFor="mode"
              className="block text-md font-medium text-gray-700"
            >
              Mode
            </label>

            <select
              name="mode"
              onChange={(e) => setMode(e.target.value)}
              className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
            >
              <option value="phone">Phone</option>
              <option value="wa">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Comm Summary
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              rows={5}
              name="description"
              id="description"
              placeholder="Communication Summary"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <button
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
            type="submit"
          >
            Add Comm
            {apiLoading && (
              <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

const FiltersModal = (props) => {
  return (
    <Modal
      onActionButtonClick={() => {
        props.setSelectedLeads([]);
        props.getPaginatedLeads(1);
        props.setModalOpen(false);
      }}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      actionText="Filter"
    >
      <div>
        <div className="grid grid-cols-4 gap-x-4 space-y-4 px-4 text-sm sm:px-6 md:gap-x-8 lg:px-8">
          <fieldset className="col-span-2">
            <legend className="block font-medium">Batch</legend>
            <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
              {props.demoBatches.map((option, optionIdx) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={option.id}
                    name="batch"
                    type="radio"
                    checked={props.filterParams.batchId == option.id}
                    value={option.name}
                    onChange={() =>
                      props.setFilterParams({
                        ...props.filterParams,
                        batchId: option.id,
                      })
                    }
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor={option.id}
                    className="ml-3 block text-sm text-gray-700"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="block font-medium">Start/End Date</legend>
            <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4"></div>
          </fieldset>
          {/* <fieldset>
            <legend className="block font-medium">Status</legend>
            <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
              {filters.status.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    disabled
                    id={option.value}
                    onChange={() =>
                      props.setFilterParams({
                        ...props.filterParams,
                        status: option.value,
                      })
                    }
                    checked={props.filterParams.status == option.value}
                    name="status"
                    type="radio"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset> */}
          <fieldset>
            <legend className="block font-medium">Source</legend>
            <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
              {filters.source.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    disabled
                    id={option.value}
                    onChange={() =>
                      props.setFilterParams({
                        ...props.filterParams,
                        source: option.value,
                      })
                    }
                    checked={props.filterParams.source == option.value}
                    name="source"
                    type="radio"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="block font-medium">Lead Date</legend>
            <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
              {filters.leadDate.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={option.value}
                    onChange={() =>
                      props.setFilterParams({
                        ...props.filterParams,
                        leadDate: option.value,
                      })
                    }
                    checked={props.filterParams.leadDate == option.value}
                    name="leadDate"
                    type="radio"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="block font-medium">Paid</legend>
            <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
              {filters.paid.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    disabled
                    id={option.value}
                    onChange={() =>
                      props.setFilterParams({
                        ...props.filterParams,
                        paid: option.value,
                      })
                    }
                    checked={props.filterParams.paid == option.value}
                    name="paid"
                    type="radio"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </Modal>
  );
};

const SendWAModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [props.open]);

  const templateChange = (obj) => {
    setMessage(obj.description);
    setSelectedTemplate(obj);
  };

  const sendMessageApi = (mode) => {
    setApiLoading(true);
    let vars = {};
    let api = "";

    if (!selectedTemplate) {
      toast.error("Template message not selected.");
      return;
    }

    if (mode !== "all") {
      if (props.selectedLeadsLength == 0) {
        toast.error("No person Selected.");
        props.setOpen(false);
        return;
      }
    }

    if (mode == "all") {
      vars = {
        batch_ids: ["2", "3", "4"],
        // batch_ids: ["4"],
        template_name: selectedTemplate.title,
      };
      api = "https://api.habuild.in/api/notification/whatsapp/batch";
    } else {
      const member_ids = props.selectedLeads.map((item) => {
        return item.member_id;
      });
      vars = {
        member_ids,
        template_name: selectedTemplate.title,
      };
      api = "https://api.habuild.in/api/notification/whatsapp";
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(vars);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // console.log(api);
    // console.log(vars);

    fetch(api, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        toast.success("Message sent successfully!");
        // if (result.errorMessage) {
        //   toast.error(result.errorMessage);
        // } else {
        //   toast.success(result.message);
        // }
        props.setSelectedLeads([]);
        props.setOpen(false);
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        console.log("error", error);
      });
  };

  return (
    // <Modal
    //   modalOpen={props.viewSendWAModal}
    //   setModalOpen={props.setViewSendWAModal}
    //   actionText="Send"
    // >
    <div className="bg-white overflow-hidden shadow rounded-lg mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div>{props.selectedLeadsLength} people selected</div>

          <div className="w-full">
            <FancySelect
              parentOnchange={templateChange}
              templateOptions={props.watiTemplates}
            ></FancySelect>
          </div>

          <div>
            <label
              htmlFor="first-name"
              className="block text-md font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              disabled
              value={message}
              rows={20}
              name="message"
              id="message"
              autoComplete="message"
              className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
            />
          </div>

          {apiLoading ? (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          ) : (
            <>
              <button
                onClick={() => {
                  if (!apiLoading) {
                    sendMessageApi();
                  }
                }}
                className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
              >
                Send Message to Selected People
              </button>

              <button
                onClick={() => {
                  if (!apiLoading) {
                    if (window.confirm("Are you sure you want to do this?")) {
                      sendMessageApi("all");
                    }
                  }
                }}
                className="px-4 py-2 font-medium rounded-md bg-green-300 text-green-700 hover:bg-green-700 hover:text-white"
              >
                Send Message to All Leads
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    // </Modal>
  );
};

const StopWACommModal = (props) => {
  const [apiLoading, setApiLoading] = useState();

  const apiCall = (status) => {
    setApiLoading(true);

    const selectedLeadsIds = props.selectedLeads.map((item) => item.member_id);

    console.log("Selected Leads ids", selectedLeadsIds);

    if (selectedLeadsIds.length == 0) {
      setApiLoading(false);
      props.setOpen(false);
      toast.error("No Lead selected.");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      lead_member_ids: selectedLeadsIds,
      status,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // fetch("http://localhost:4000/api/lead/updateLeadCommStatus", requestOptions)
    fetch(
      "https://api.habuild.in/api/lead/updateLeadCommStatus",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (result.errorMessage) {
          toast.error(result.errorMessage);
        } else {
          toast.success(result.message);
        }
        props.getPaginatedLeads();
        props.setSelectedLeads([]);
        props.setOpen(false);
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        console.log("error", error);
      });
  };

  return (
    // <Modal
    //   apiLoading={apiLoading}
    //   modalOpen={props.viewStopWACommModal}
    //   setModalOpen={props.setViewStopWACommModal}
    //   hideActionButtons
    // >
    <div className="bg-white overflow-hidden shadow rounded-lg mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4 p-4 mt-4">
          <div>{props.selectedLeadsLength} people selected</div>

          <button
            disabled={apiLoading}
            onClick={() => apiCall("PAUSED")}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
            type="submit"
          >
            Stop WA Communication
            {apiLoading && (
              <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
            )}
          </button>
          <button
            disabled={apiLoading}
            onClick={() => apiCall("ACTIVE")}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
            type="submit"
          >
            Start WA Communication
            {apiLoading && (
              <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
            )}
          </button>
        </div>
      </div>
    </div>

    // </Modal>
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
          dataSource={props.comms?.map((item) => {
            return {
              mode: item.mode,
              message: item.description,
              time: format(parseISO(item.created_at), "PPpp"),
              // destination: item.d
            };
          })}
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
      mobile_number: "91" + phone,
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
        props.getPaginatedLeads(1);
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        toast.error("No lead created");
        // console.log("error", error);
      });
  };

  return (
    <Modal
      apiLoading={apiLoading}
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
        <h2 className="text-left text-xl font-bold text-gray-900">Add Lead</h2>

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
