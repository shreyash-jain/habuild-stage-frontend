import { useState } from "react";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { MinusCircleIcon } from "@heroicons/react/solid";
import GiftMembershipModal from "./GiftMembership";
import StopMembership from "./stopMembership";
import PauseMembership from "./PauseMembership";
import ChangeMemberChannel from "./ChangeMemberChannel";
import ChangePrefferedBatch from "./ChangePrefferedBatch";

const tabs = [
  { name: "Selected Members", href: "#", current: false },
  { name: "Actions", href: "#", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SelectedMembersFloat = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Selected Members");
  const [viewGiftMembershipModal, setViewGiftMembershipModal] = useState(false);
  const [viewChangePrefferedBatchModal, setViewChangePrefferedBatchModal] =
    useState(false);
  const [stopMembershipModal, setStopMembershipModal] = useState(false);
  const [pauseMembershipModal, setPauseMembershipModal] = useState(false);
  const [changeChannelModal, setChangeChannelModal] = useState(false);

  if (props.selectedMembers?.length == 0) {
    return null;
  }

  const columns = [
    {
      title: "Member Id",
      dataIndex: "id",
      key: "id",
    },
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
      title: "Phone",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Remove From Selection",
      dataIndex: "isSelected",
      key: "isSelected",
      render: (isSelected) => {
        return (
          <button
            onClick={() => props.removeSelection(isSelected.identifier)}
            title="Unselect Member"
          >
            <MinusCircleIcon className="h-6 w-6 text-red-400 hover:text-red-600 cursor-pointer" />
          </button>
        );
      },
    },
  ];

  const actionButtonTriggers = [
    {
      actionName: "Gift Membership",
      viewSetter: setViewGiftMembershipModal,
    },
    {
      actionName: "Stop/Refund Membership",
      viewSetter: setStopMembershipModal,
    },
    {
      actionName: "Pause Membership",
      viewSetter: setPauseMembershipModal,
    },
    {
      actionName: "Resume Membership",
      viewSetter: triggerResumeMembershipAction,
    },
    {
      actionName: "Change Member Channel",
      viewSetter: setChangeChannelModal,
    },
    {
      actionName: "Change Preffered Batch",
      viewSetter: setViewChangePrefferedBatchModal,
    },
  ];

  function triggerResumeMembershipAction(garbageValue) {
    if (
      !window.confirm(
        "Do you want to Resume Membership for ALL selected members?"
      )
    ) {
      return;
    }

    for (let i = 0; i < props.selectedMembers.length; i++) {
      props.resumeMembership(props.selectedMembers[i], "groupActions");
    }
  }

  return (
    <div className="fixed bg-green-50 text-gray-700 overflow-hidden bottom-2 left-64 animate-bounce rounded-lg p-3 px-6 drop-shadow bg-white">
      <span className="text-green-700 font-medium mr-2">
        {props.selectedMembers?.length}
      </span>
      Members Selected for Action
      <buton
        onClick={() => setShowModal(true)}
        className="text-sm px-2 py-1 bg-white rounded-md ml-4 hover:bg-gray-100 font-medium cursor-pointer"
      >
        View
      </buton>
      <Modal
        modalOpen={showModal}
        setModalOpen={setShowModal}
        hideActionButtons
      >
        <div className="flex flex-col">
          <div className="block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setSelectedTab(tab.name)}
                  className={`
                    ${
                      selectedTab == tab.name
                        ? "bg-green-100 text-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <hr className="mt-3"></hr>

          {selectedTab == "Selected Members" ? (
            <Table columns={columns} dataSource={props.selectedMembers} />
          ) : (
            <div className="p-8">
              <div className="flex flex-col space-y-4">
                {actionButtonTriggers.map((item) => {
                  console.log(item);
                  return (
                    <button
                      key={item.actionName}
                      className="px-4 py-2 font-medium border border-green-300 text-gray-800 hover:bg-gray-100 rounded-md max-w-fit"
                      onClick={() => item.viewSetter(true)}
                    >
                      {item.actionName}
                    </button>
                  );
                })}
              </div>

              <GiftMembershipModal
                modalOpen={viewGiftMembershipModal}
                setModalOpen={setViewGiftMembershipModal}
                selectedMembers={props.selectedMembers}
                calledFrom="groupActions"
              />

              <StopMembership
                modalOpen={stopMembershipModal}
                setModalOpen={setStopMembershipModal}
                selectedMembers={props.selectedMembers}
                calledFrom="groupActions"
              />

              <PauseMembership
                modalOpen={pauseMembershipModal}
                setModalOpen={setPauseMembershipModal}
                selectedMembers={props.selectedMembers}
                calledFrom="groupActions"
              />

              <ChangeMemberChannel
                modalOpen={changeChannelModal}
                setModalOpen={setChangeChannelModal}
                selectedMembers={props.selectedMembers}
                calledFrom="groupActions"
              />

              <ChangePrefferedBatch
                modalOpen={viewChangePrefferedBatchModal}
                setModalOpen={setViewChangePrefferedBatchModal}
                selectedMembers={props.selectedMembers}
                calledFrom="groupActions"
                memberProgramsWithBatches={props.memberProgramsWithBatches}
                memberBatches={props.memberBatches}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SelectedMembersFloat;
