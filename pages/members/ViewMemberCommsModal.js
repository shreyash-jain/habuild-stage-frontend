import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { MembersApis } from "../../constants/apis";
import { format, parseISO } from "date-fns";

const ViewMemberCommsModal = (props) => {
  const [memberComms, setMemberComms] = useState([]);

  useEffect(() => {
    if (props.memberForAction?.id) {
      getComms();
    }
  }, [props.memberForAction?.id]);

  const getComms = async () => {
    await fetch(MembersApis.GET_COMM_LOGS(props.memberForAction?.id))
      .then((res) => res.json())
      .then((data) => {
        setMemberComms(data);
      });
  };

  const columns = [
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Template Identifier",
      dataIndex: "template_identifier",
      key: "template_identifier",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      modalOpen={props.modalOpen ? props.modalOpen : false}
      setModalOpen={props.setModalOpen}
      hideActionButtons
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-left text-xl font-bold text-gray-900">
          Communications
        </h2>

        {memberComms.length > 0 ? (
          <Table
            columns={columns}
            pagination={false}
            dataSource={memberComms?.map((item) => {
              // console.log("IITem", item);
              return {
                mode: item.mode,
                template_identifier: item.template_identifier,
                time: item.created_at,
                destination: item.mode,
              };
            })}
          />
        ) : (
          "No Comms to View."
        )}
      </div>
    </Modal>
  );
};

export default ViewMemberCommsModal;
