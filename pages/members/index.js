import React, { useEffect, useState, Fragment } from "react";

import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";
import {
  XCircleIcon,
  CheckCircleIcon,
  MenuAlt1Icon,
  ExternalLinkIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import toast from "react-hot-toast";
import MemberInfoSidePanel from "./memberInfoSidePanel";
import MenuSidePanel from "./MenuSidePanel";
import GiftMembershipModal from "./GiftMembership";
import StopMembership from "./stopMembership";
import PauseMembership from "./PauseMembership";
import UpdateMemberDetails from "./UpdateMemberDetails";
import ChangeMemberChannel from "./ChangeMemberChannel";
import ChangePrefferedBatch from "./ChangePrefferedBatch";
import SelectedMembersFloat from "./SelectedMembersFloat";
import {
  ProgramsApis,
  BatchesApis,
  MembersApis,
  ReRegisterApis,
} from "../../constants/apis";
import Image from "next/image";
import ViewMemberCommsModal from "./ViewMemberCommsModal";
import UpdateEmailModal from "./UpdateEmailModal";
import UpdateSlashtagModal from "./UpdateSlashtagModal";
import useCheckAuth from "../../hooks/useCheckAuth";
import { useFetchWrapper } from "../../utils/apiCall";
import ChangeMemberCurrentChannel from "./ChangeMemberCurrentChannel";

const Members = (props) => {
  // const checkAuthLoading = useCheckAuth(false);
  const checkAuthLoading = false;

  const { customFetch, customFetchFile } = useFetchWrapper();

  const [members, setMembers] = useState([]);
  const [viewMemberInfo, setViewMemberInfo] = useState(false);
  const [viewUpdateMemberInfo, setViewUpdateMemberInfo] = useState(false);
  const [viewGiftMembershipModal, setViewGiftMembershipModal] = useState(false);
  const [stopMembershipModal, setStopMembershipModal] = useState(false);
  const [pauseMembershipModal, setPauseMembershipModal] = useState(false);
  const [changeChannelModal, setChangeChannelModal] = useState(false);
  const [changeCurrentChannelModal, setChangeCurrentChannelModal] =
    useState(false);
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
  const [searchFor, setSearchFor] = useState("Name");

  const [viewCommsModal, setViewCommsModal] = useState(false);
  const [viewChangePrefferedBatchModal, setViewChangePrefferedBatchModal] =
    useState(false);

  const [allSelectChecked, setAllSelectChecked] = useState(false);
  const [viewUpdateEmailModal, setViewUpdateEmailModal] = useState(false);
  const [viewUpdateSlashtagModal, setViewUpdateSlashtagModal] = useState(false);

  useEffect(() => {
    if (!checkAuthLoading) {
      getMembers(1);
      getMemberBatches();
    }
  }, [checkAuthLoading]);

  const getMemberBatches = async () => {
    const data = await customFetch(ProgramsApis.GET_PROGRAMS(), "GET", {});
    if (data.programs.length > 0) {
      const programsWithBatches = [];
      let allBatches = [];

      // console.log("Program Data", data);

      for (let i = 0; i < data.programs.length; i++) {
        const data1 = await customFetch(
          BatchesApis.GET_BATCH_FROM_PROGRAM(data.programs[i].id),
          "GET",
          {}
        );

        programsWithBatches.push({
          ...data.programs[i],
          batches: data1.batch,
        });
        allBatches = [...allBatches, ...data1.batch];
      }

      setMemberProgramsWithBatches(programsWithBatches);
      // console.log("All batches", allBatches);
      setMemberBatches(allBatches);
    }
  };

  const getMembers = async (pageNum) => {
    setLoading(true);
    setCurrentPagePagination(pageNum);
    setAllSelectChecked(false);

    const data = await customFetch(MembersApis.GET(pageNum), "GET", {});
    // console.log("DATA", data);

    setMembers(
      data.data.members.map((item) => {
        let selectedValue = false;

        for (let i = 0; i < selectedMembers.length; i++) {
          if (selectedMembers[i].id == item.id) {
            selectedValue = true;
            break;
          }
        }

        return {
          ...item,
          isSelected: {
            identifier: item.id,
            value: selectedValue,
          },
          action: item,
        };
      })
    );
    setTotalRecords(data.data.totalRecords);
    setLoading(false);
  };

  const menuItems = [
    {
      name: "Change Current Channel",
      onClick: (actionEntity) => {
        if (actionEntity.status !== "INACTIVE") {
          setMemberForAction(actionEntity);
          setChangeCurrentChannelModal(true);
        } else {
          toast.error(
            "Can only change current channel for ACTIVE/PAUSED Members"
          );
        }
      },
    },
    {
      name: "View Member Comms",
      onClick: (actionEntity) => {
        setMemberForAction(actionEntity);
        setViewCommsModal(true);
      },
    },
    // {
    //   name: "Change Preffered Channel",
    //   onClick: (actionEntity) => {
    //     if (actionEntity.status !== "INACTIVE") {
    //       setMemberForAction(actionEntity);
    //       setChangeChannelModal(true);
    //     } else {
    //       toast.error("Can only change channel for ACTIVE/PAUSED Members");
    //     }
    //   },
    // },
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
    {
      name: "Re-Register Member",
      onClick: (actionEntity) => {
        if (actionEntity.status == "ACTIVE") {
          memberReRegister(actionEntity);
        } else {
          toast.error("Can only Re-Register an ACTIVE member.");
        }
      },
    },
    {
      name: "Change Preffered Batch",
      onClick: (actionEntity) => {
        if (actionEntity.status !== "INACTIVE") {
          setMemberForAction(actionEntity);
          setViewChangePrefferedBatchModal(true);
        } else {
          toast.error("Can only change batch for an ACTIVE member.");
        }
      },
    },
    {
      name: "Update Email",
      onClick: (actionEntity) => {
        setMemberForAction(actionEntity);
        setViewUpdateEmailModal(true);
      },
    },
    {
      name: "Change Slashtag",
      onClick: (actionEntity) => {
        setMemberForAction(actionEntity);
        setViewUpdateSlashtagModal(true);
      },
    },
  ];

  const memberReRegister = async (memberObj) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = {
      memberId: memberObj.id,
    };

    const data = await customFetch(ReRegisterApis.MEMBER(), "POST", raw);

    // console.log("ReRegister DATAAAA", data);

    if (data.status == 500) {
      toast.error("Failed to Re-Register Member");
    } else if (data.status == 200) {
      toast.success(`Successfully Re-Registered, message: ${data?.message}`);
    } else {
      toast.error("Unkown Error occured");
    }
  };

  const resumeMembership = async (actionEntity, calledFrom) => {
    if (calledFrom !== "groupActions") {
      if (
        !window.confirm(
          `Are you sure you want to Resume Membership for ${actionEntity.name}?`
        )
      ) {
        return;
      }
    }

    try {
      const result = await customFetch(
        MembersApis.ACTIVATE_MEMBERSHIP(actionEntity.id),
        "PATCH",
        {}
      );

      if (result.status == 500) {
        toast.error(result?.message);
      } else {
        toast.success(result?.message);
      }
      getMembers(currentPagePagination);
      // console.log(result);
    } catch (error) {
      // toast.error(error);
      // console.log("error", error);
    }
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
    let newSelectedLeads = [...selectedMembers];

    for (let i = 0; i < newLeads.length; i++) {
      if (checked) {
        const elementInArr = newSelectedLeads.find(
          (item) => newLeads[i].id === item.id
        );

        if (!elementInArr) {
          newSelectedLeads.push(newLeads[i]);
          newLeads[i].isSelected.value = true;
        }
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
            checked={allSelectChecked}
            onChange={(e) => {
              setAllSelectChecked(!allSelectChecked);
              handleSelectAll(!allSelectChecked);
            }}
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
      dataIndex: "total_remaining_days",
      key: "total_remaining_days",
      render: (days) => {
        if (days) {
          return days;
        }
      },
    },
    // {
    //   title: "Current Week Attendance",
    //   dataIndex: "current_week_attendance",
    //   key: "current_week_attendance",
    //   render: (attendance) => {
    //     return (
    //       <div className="flex relative -z-1 overflow-hidden">
    //         {attendance?.map((item) => {
    //           if (item) {
    //             return (
    //               <span key={item.day} title={item.day}>
    //                 <CheckCircleIcon className="text-green-400 h-6" />
    //               </span>
    //             );
    //           } else {
    //             return (
    //               <span key={item.day} title={item.day}>
    //                 <XCircleIcon className="text-red-400 h-6" />
    //               </span>
    //             );
    //           }
    //         })}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Preffered Channel",
      dataIndex: "channel",
      key: "channel",
      render: (channel) => {
        if (channel === "ZOOM") {
          return (
            <Image
              layout="responsive"
              width={20}
              height={8}
              src="/assets/zoom_logo.png"
            />
          );
        }
        if (channel === "YOUTUBE") {
          return (
            <Image
              layout="responsive"
              width={30}
              height={7}
              src="/assets/youtube_logo.jpg"
            />
          );
        }

        return "-";
      },
    },
    {
      title: "Current Channel",
      dataIndex: "current_channel",
      key: "current_channel",
      render: (channel) => {
        if (channel === "ZOOM") {
          return (
            <Image
              layout="responsive"
              width={20}
              height={8}
              src="/assets/zoom_logo.png"
            />
          );
        }
        if (channel === "YOUTUBE") {
          return (
            <Image
              layout="responsive"
              width={30}
              height={7}
              src="/assets/youtube_logo.jpg"
            />
          );
        }

        return "-";
      },
    },
    {
      title: "Plan Name",
      dataIndex: "plan_name",
      key: "plan_name",
      render: (plans) => {
        if (plans) {
          return JSON.stringify(plans).replace(/[^a-z0-9]/gi, " ");
        } else {
          return "NA";
        }
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

  const handleSearch = async () => {
    setLoading(true);
    // setSelectedMembers([]);
    if (!searchTerm || !searchFor) {
      return;
    }

    const data = await customFetch(
      MembersApis.SEARCH(searchTerm, searchFor),
      "GET",
      {}
    );
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
  };

  const handleSearchCancel = () => {
    setSearchTerm("");
    getMembers(1);
  };

  if (checkAuthLoading) {
    return <RefreshIcon className="text-green-300 h-8 w-8 mx-auto" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Members</h1>

      <div className="min-w-0 flex-1 md:px-4 lg:px-0 xl:col-span-6">
        <div className="flex items-center py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            {/* <div className="relative">
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
            </div> */}
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="searchFor" className="sr-only">
                  searchFor
                </label>
                <select
                  value={searchFor}
                  onChange={(e) => setSearchFor(e.target.value)}
                  id="searchFor"
                  name="searchFor"
                  autoComplete="searchFor"
                  className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-1 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                >
                  <option>Name</option>
                  <option>Email</option>
                  <option>Mobile</option>
                  <option>Member Id</option>
                </select>
              </div>

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                id="search"
                name="search"
                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-24 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search Member by Phone number, name or email."
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
        onClick={() => setShowMenuSidebar(true)}
        className="transition duration-300 font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-5"
      >
        <MenuAlt1Icon className="w-6 h-6" />
      </button>

      <MemberInfoSidePanel
        memberForAction={memberForAction}
        open={viewMemberInfo}
        setOpen={setViewMemberInfo}
        customFetch={customFetch}
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
        customFetch={customFetch}
        customFetchFile={customFetchFile}
      />

      <GiftMembershipModal
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={viewGiftMembershipModal}
        setModalOpen={setViewGiftMembershipModal}
        memberForAction={memberForAction}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <StopMembership
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={stopMembershipModal}
        setModalOpen={setStopMembershipModal}
        memberForAction={memberForAction}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <PauseMembership
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={pauseMembershipModal}
        setModalOpen={setPauseMembershipModal}
        memberForAction={memberForAction}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <UpdateMemberDetails
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={viewUpdateMemberInfo}
        setModalOpen={setViewUpdateMemberInfo}
        memberForAction={memberForAction}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <ChangeMemberChannel
        modalOpen={changeChannelModal}
        setModalOpen={setChangeChannelModal}
        memberForAction={memberForAction}
        getPaginatedLeads={getMembers}
        currentPagePagination={currentPagePagination}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <ViewMemberCommsModal
        memberForAction={memberForAction}
        modalOpen={viewCommsModal}
        setModalOpen={setViewCommsModal}
        customFetch={customFetch}
      />

      <ChangePrefferedBatch
        memberForAction={memberForAction}
        modalOpen={viewChangePrefferedBatchModal}
        setModalOpen={setViewChangePrefferedBatchModal}
        memberProgramsWithBatches={memberProgramsWithBatches}
        memberBatches={memberBatches}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <SelectedMembersFloat
        selectedMembers={selectedMembers}
        removeSelection={handleSelect}
        memberProgramsWithBatches={memberProgramsWithBatches}
        memberBatches={memberBatches}
        resumeMembership={resumeMembership}
        customFetch={customFetch}
      />

      <UpdateEmailModal
        memberForAction={memberForAction}
        modalOpen={viewUpdateEmailModal}
        setModalOpen={setViewUpdateEmailModal}
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />

      <UpdateSlashtagModal
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        memberForAction={memberForAction}
        modalOpen={viewUpdateSlashtagModal}
        setModalOpen={setViewUpdateSlashtagModal}
        customFetch={customFetch}
      />

      <ChangeMemberCurrentChannel
        modalOpen={changeCurrentChannelModal}
        setModalOpen={setChangeCurrentChannelModal}
        memberForAction={memberForAction}
        getPaginatedLeads={getMembers}
        currentPagePagination={currentPagePagination}
        refetchData={handleSearch}
        searchFor={searchFor}
        searchTerm={searchTerm}
        customFetch={customFetch}
      />
    </div>
  );
};

Members.getLayout = LayoutSidebar;

export default Members;
