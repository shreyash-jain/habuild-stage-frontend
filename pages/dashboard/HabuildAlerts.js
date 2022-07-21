import { useState, useEffect } from "react";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { HabuildAlertsApis } from "../../constants/apis";
import { RefreshIcon } from "@heroicons/react/outline";

const HabuildAlerts = () => {
  const [numDays, setNumDays] = useState(1);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    getAlerts();
  }, []);

  useEffect(() => {
    getAlerts();
  }, [numDays]);

  const getAlerts = () => {
    setLoading(true);
    fetch(HabuildAlertsApis.GET(numDays))
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setAlerts(data.result);
        // console.log("Alerts Data", data);
      });
  };

  const columns = [
    {
      title: "Alert Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Member Id",
      dataIndex: "member_id",
      key: "member_id",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
  ];

  return (
    <div className="mt-8 border border-gray-100 shadow-md rounded-md p-2 max-w-fit">
      <h1 className="text-lg font-medium text-gray-900">Habuild Alerts</h1>

      {loading ? (
        <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
      ) : (
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => getAlerts(numDays)}
            className="border-2 border-green-400 rounded-md px-3 py-1 font-medium text-gray-700"
          >
            Refetch
          </button>

          <span className="text-red-400">{alerts.length} Recent Alerts</span>
          <button
            onClick={() => setShowAllAlerts(true)}
            className="rounded-md px-3 py-1 bg-green-300 font-medium text-green-700 hover:bg-green-600 hover:text-white"
          >
            View All
          </button>
        </div>
      )}

      <Modal
        modalOpen={showAllAlerts}
        setModalOpen={setShowAllAlerts}
        hideActionButtons
        overflowFix
      >
        <label>View alerts for </label>
        <input
          className="p-2 border border-gray-400 rounded-md max-w-fit"
          type={"number"}
          value={numDays}
          min={1}
          onChange={(e) => {
            if (e.target.value) {
              setNumDays(e.target.value);
            } else {
              setNumDays(1);
            }
          }}
        />
        <span>Days</span>

        <Table dataLoading={loading} columns={columns} dataSource={alerts} />
      </Modal>
    </div>
  );
};

export default HabuildAlerts;
