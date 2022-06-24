import React, { useEffect, useState, Fragment } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";
import Modal from "../../components/Modal";
import {
  RefreshIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
  MenuAlt1Icon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import MemberInfoSidePanel from "./memberInfoSidePanel";
import MenuSidePanel from "./MenuSidePanel";
import GiftMembershipModal from "./GiftMembership";
import StopMembership from "./stopMembership";
import PauseMembership from "./PauseMembership";
import UpdateMemberDetails from "./UpdateMemberDetails";
import { ProgramsApis, BatchesApis, MembersApis } from "../../constants/apis";

const Members = (props) => {
  const [members, setMembers] = useState([]);
  const [viewMemberInfo, setViewMemberInfo] = useState(false);
  const [viewUpdateMemberInfo, setViewUpdateMemberInfo] = useState(false);
  const [viewGiftMembershipModal, setViewGiftMembershipModal] = useState(false);
  const [stopMembershipModal, setStopMembershipModal] = useState(false);
  const [pauseMembershipModal, setPauseMembershipModal] = useState(false);
  const [memberForAction, setMemberForAction] = useState({});
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPagePagination, setCurrentPagePagination] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberProgramsWithBatches, setMemberProgramsWithBatches] = useState(
    []
  );
  const [memberBatches, setMemberBatches] = useState([]);

  useEffect(() => {
    getMembers(1);
    getMemberBatches();
  }, []);

  const getMemberBatches = async () => {
    // await fetch(`https://api.habuild.in/api/program/`)
    await fetch(ProgramsApis.GET_PROGRAMS())
      .then((res) => res.json())
      .then(async (data) => {
        if (data.programs.length > 0) {
          const programsWithBatches = [];
          let allBatches = [];

          console.log("Program Data", data);

          for (let i = 0; i < data.programs.length; i++) {
            await fetch(BatchesApis.GET_BATCH_FROM_PROGRAM(data.programs[i].id))
              .then((res) => res.json())
              .then((data1) => {
                programsWithBatches.push({
                  ...data.programs[i],
                  batches: data1.batch,
                });
                allBatches = [...allBatches, ...data1.batch];
              });
          }

          setMemberProgramsWithBatches(programsWithBatches);
          console.log("All batches", allBatches);
          setMemberBatches(allBatches);
        }
      });
  };

  const getMembers = async (pageNum) => {
    setLoading(true);
    setCurrentPagePagination(pageNum);

    await fetch(MembersApis.GET(pageNum))
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA", data);
        setMembers(
          data.data.members.map((item) => {
            return {
              ...item,
              isSelected: {
                identifier: item.id,
                value: false,
              },
              action: item,
            };
          })
        );
        setTotalRecords(data.data.totalRecords);
        setLoading(false);
      });
  };

  const menuItems = [
    {
      name: "Update Member Details",
      onClick: (actionEntity) => {
        setMemberForAction(actionEntity);
        setViewUpdateMemberInfo(true);
      },
    },
    {
      name: "View",
      onClick: (actionEntity) => {
        setMemberForAction(actionEntity);
        setViewMemberInfo(true);
      },
    },
    {
      name: "Gift Membership",
      onClick: (actionEntity) => {
        if (actionEntity.status !== "INACTIVE") {
          setMemberForAction(actionEntity);
          setViewGiftMembershipModal(true);
        } else {
          toast.error("Cannot Gift Membership to Inactive Members.");
        }
      },
    },
    {
      name: "Stop/Refund Membership",
      onClick: (actionEntity) => {
        if (actionEntity.status !== "INACTIVE") {
          setMemberForAction(actionEntity);
          setStopMembershipModal(true);
        } else {
          toast.error("Cannot Stop/Refund Membership of Inactive Members.");
        }
      },
    },
    {
      name: "Resume Membership",
      onClick: (actionEntity) => {
        if (actionEntity.status == "PAUSED") {
          resumeMembership(actionEntity);
        } else {
          toast.error("Can only resume membership for PAUSED members.");
        }
      },
    },
    {
      name: "Pause Membership",
      onClick: (actionEntity) => {
        if (actionEntity.status == "ACTIVE") {
          setMemberForAction(actionEntity);
          setPauseMembershipModal(true);
        } else {
          toast.error("Can only PAUSE membership for ACTIVE members.");
        }
      },
    },
  ];

  const resumeMembership = (actionEntity) => {
    if (
      !window.confirm(
        `Are you sure you want to Resume Membership for ${actionEntity.name}?`
      )
    ) {
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: "",
      redirect: "follow",
    };
    fetch(MembersApis.ACTIVATE_MEMBERSHIP(actionEntity.id), requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 500) {
          toast.error(result?.message);
        } else {
          toast.success(result?.message);
        }
        props.getPaginatedLeads(props.currentPagePagination);
        // console.log(result);
      })
      .catch((error) => {
        // toast.error(error);
        // console.log("error", error);
      });
  };

  const handleSelect = (identifier) => {
    let newSelectedLeads = [...selectedMembers];
    const newLeads = [...members];
    // const index = newSelectedLeads.indexOf(identifier);

    for (let i = 0; i < newLeads.length; i++) {
      if (newLeads[i].id === identifier) {
        if (newLeads[i].isSelected.value == true) {
          newSelectedLeads = newSelectedLeads.filter(
            (item) => item.id !== identifier
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

    setMembers(newLeads);
    setSelectedMembers(newSelectedLeads);
  };

  const handleSelectAll = (checked) => {
    const newLeads = [...members];
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
      setSelectedMembers([]);
    } else {
      setSelectedMembers(newSelectedLeads);
    }

    setMembers(newLeads);
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
      title: "Member Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (actionEntity) => {
        return (
          <>
            <ExternalLinkIcon
              className="h-5 w-5 text-green-400 cursor-pointer hover:text-green-600"
              onClick={() => {
                setMemberForAction(actionEntity);
                setViewMemberInfo(true);
              }}
            />
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone No.",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },

    {
      title: "WA Comm. Status",
      dataIndex: "wa_communication_status",
      key: "wa_communication_status",
      render: (status) => {
        if (status == "ACTIVE") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-300 text-green-800">
              {status}
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-300 text-red-800">
              {status}
            </span>
          );
        }
      },
    },
    {
      title: "Subscription Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <span
            className={`text-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
              status == "PAUSED" && "bg-yellow-300 text-yellow-800"
            } ${status == "ACTIVE" && "bg-green-300 text-green-800"} ${
              status == "INACTIVE" && "bg-red-300 text-red-800"
            }  `}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Days Left",
      dataIndex: "sub_end_date",
      key: "sub_end_date",
      render: (date) => {
        if (date) {
          const startDate = new Date().getTime();
          const endDate = new Date(date).getTime();
          const timeDiff = Math.abs(endDate - startDate);
          const dayDiff = parseInt(timeDiff / (1000 * 60 * 60 * 24));
          return dayDiff;
        }
      },
    },
    {
      title: "Current Week Attendance",
      dataIndex: "current_week_attendance",
      key: "current_week_attendance",
      render: (attendance) => {
        return (
          <div className="flex relative -z-1 overflow-hidden">
            {attendance?.map((item) => {
              if (item) {
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
      title: "Plan Name",
      dataIndex: "plan_name",
      key: "plan_name",
      render: (plans) => {
        return JSON.stringify(plans).replace(/[^a-z0-9]/gi, " ");
      },
    },
    {
      title: "Preffered Batch",
      dataIndex: "preffered_batch_id",
      key: "preffered_batch_id",
      render: (prefferedBatchId) => {
        const prefferedBatch = memberBatches.find(
          (item) => item.id === prefferedBatchId
        );
        return <span>{prefferedBatch?.name || prefferedBatchId}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (actionEntity) => {
        return (
          <FlyoutMenu
            menuItems={menuItems}
            actionEntity={actionEntity}
          ></FlyoutMenu>
        );
      },
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    setSelectedMembers([]);
    if (!searchTerm) {
      return;
    }

    fetch(MembersApis.SEARCH(searchTerm))
      .then((res) => res.json())
      .then((data) => {
        // console.log("Search data", data);
        if (data.message) {
          toast.error(JSON.stringify(data.message));
          setLoading(false);
          return;
        }

        setMembers(
          data.data.map((item) => {
            return {
              ...item,
              isSelected: {
                identifier: item.id,
                value: false,
              },
              action: item,
            };
          })
        );

        setLoading(false);
      });
  };

  const handleSearchCancel = () => {
    setSearchTerm("");
    getMembers(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Members</h1>

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
                placeholder="Search Member by Phone number, name or email."
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

      <Table
        dataLoading={loading}
        onPaginationApi={getMembers}
        totalRecords={totalRecords}
        columns={columns}
        pagination
        dataSource={members}
        currentPagePagination={currentPagePagination}
      />

      <button
        // onClick={() => setViewAddLeadModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Member +
      </button>

      <button
        onClick={() => setShowMenuSidebar(true)}
        className="transition duration-300 font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-40"
      >
        <MenuAlt1Icon className="w-6 h-6" />
      </button>

      <MemberInfoSidePanel
        memberForAction={memberForAction}
        open={viewMemberInfo}
        setOpen={setViewMemberInfo}
      />

      <MenuSidePanel
        // searchTerm={searchTerm}
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        selectedLeads={selectedMembers}
        setSelectedLeads={setSelectedMembers}
        open={showMenuSidebar}
        setOpen={setShowMenuSidebar}
        // demoBatches={demoBatches}
        memberProgramsWithBatches={memberProgramsWithBatches}
      />

      <GiftMembershipModal
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={viewGiftMembershipModal}
        setModalOpen={setViewGiftMembershipModal}
        memberForAction={memberForAction}
      />

      <StopMembership
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={stopMembershipModal}
        setModalOpen={setStopMembershipModal}
        memberForAction={memberForAction}
      />

      <PauseMembership
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={pauseMembershipModal}
        setModalOpen={setPauseMembershipModal}
        memberForAction={memberForAction}
      />

      <UpdateMemberDetails
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={viewUpdateMemberInfo}
        setModalOpen={setViewUpdateMemberInfo}
        memberForAction={memberForAction}
      />
    </div>
  );
};

Members.getLayout = LayoutSidebar;

export default Members;
