import { useState } from "react";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import MemberInfoSidePanel from "./memberInfoSidePanel";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { MinusCircleIcon } from "@heroicons/react/solid";

const SelectedMembersFloat = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [memberForAction, setMemberForAction] = useState({});
  const [viewMemberInfo, setViewMemberInfo] = useState(false);

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
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (actionEntity) => {
        return (
          <span title="Unselect Member">
            <MinusCircleIcon className="h-6 w-6 text-red-400 hover:text-red-600 cursor-pointer" />
          </span>
        );
      },
    },
  ];

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
        <Table columns={columns} dataSource={props.selectedMembers} />
      </Modal>
    </div>
  );
};

export default SelectedMembersFloat;
