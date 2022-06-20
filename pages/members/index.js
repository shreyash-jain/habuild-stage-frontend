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

const Members = (props) => {
  const [members, setMembers] = useState([]);
  const [viewMemberInfo, setViewMemberInfo] = useState(false);
  const [viewGiftMembershipModal, setViewGiftMembershipModal] = useState(false);
  const [memberForAction, setMemberForAction] = useState({});
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPagePagination, setCurrentPagePagination] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getMembers(1);
  }, []);

  const getMembers = async (pageNum) => {
    setLoading(true);
    setCurrentPagePagination(pageNum);

    await fetch(`https://api.habuild.in/api/member/?page=${pageNum}&limit=100`)
      // await fetch(`http://localhost:4000/api/member/?page=${pageNum}&limit=100`)
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
  ];

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
        if (status == "ACTIVE") {
          return (
            <span className="text-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-300 text-green-800">
              {status}
            </span>
          );
        } else {
          return (
            <span className="text-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-300 text-red-800">
              {status}
            </span>
          );
        }
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Members</h1>

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
      />

      <GiftMembershipModal
        currentPagePagination={currentPagePagination}
        getPaginatedLeads={getMembers}
        modalOpen={viewGiftMembershipModal}
        setModalOpen={setViewGiftMembershipModal}
        memberForAction={memberForAction}
      />
    </div>
  );
};

const GiftMembershipModal = (props) => {
  const { apiLoading, setApiLoading } = useState(false);
  const [numDays, setNumDays] = useState(0);

  const giftMembership = () => {
    setApiLoading(true);

    if (!numDays) {
      setApiLoading(false);
      toast.error("Number of Days cannot be 0");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      email: props.memberForAction.email,
      noOfDays: numDays,
      batchId: props.memberForAction.preffered_batch_id,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("https://api.habuild.in/api/member/gift_membership", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (result.status == 500) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
        }
        props.getPaginatedLeads(props.currentPagePagination);
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
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      actionText="Gift"
      onActionButtonClick={giftMembership}
      // hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700">Gifting Membership to...</h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props.memberForAction.name}
          </h1>
        </div>
        <label>No. of Days</label>
        <input
          onChange={(e) => setNumDays(e.target.value)}
          className="p-2 border border-gray-600 rounded-md ml-2"
          type={"number"}
        />
      </div>
    </Modal>
  );
};

Members.getLayout = LayoutSidebar;

export default Members;
