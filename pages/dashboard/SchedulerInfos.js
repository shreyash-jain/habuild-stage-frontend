import { useState, useEffect } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { SchedulerApis } from "../../constants/apis";

const SchedulerInfos = (props) => {
  const [schedulersInfoLoading, setSchedulersInfoLoading] = useState(true);
  const [showSchedulerInfoModal, setShowSchedulerInfoModal] = useState(false);
  const [unsuccessfullSchedulers, setUnsuccessfullSchedulers] = useState([]);
  const [schedulerInfos, setSchedulerInfos] = useState([]);

  useEffect(() => {
    getSchedulersInfos();
  }, []);

  const getSchedulersInfos = () => {
    setSchedulersInfoLoading(true);

    fetch(SchedulerApis.GET())
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setSchedulerInfos(data.message);

        const notSuccessfulSchedulers = data?.message?.filter((item) => {
          if (item.status !== "SUCCESS") {
            return item;
          }
        });

        setUnsuccessfullSchedulers(notSuccessfulSchedulers);

        setSchedulersInfoLoading(false);
      });
  };

  const columns = [
    {
      title: "Scheduler Id",
      dataIndex: "scId",
      key: "scId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Last Run",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (!status) {
          return <p className="text-gray-800">Status not Found</p>;
        }
        return (
          <span
            className={`text-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
              status == "SUCCESS"
                ? "bg-green-300 text-green-800"
                : "bg-red-300 text-red-800"
            }  `}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Last Run Date",
      dataIndex: "latestDate",
      key: "latestDate",
      render: (date) => {
        if (!date) {
          return "-";
        }

        return date.split("T")[0];
      },
    },
    {
      title: "Last Start Time",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        if (!date) {
          return "-";
        }

        return date.split("T")[1];
      },
    },
    {
      title: "Last Stop Time",
      dataIndex: "stopDate",
      key: "stopDate",
      render: (date) => {
        if (!date) {
          return "-";
        }

        return date.split("T")[1];
      },
    },
  ];

  return (
    <div className="mt-8 border border-gray-100 shadow-md rounded-md p-2 max-w-fit">
      <h1 className="text-lg font-medium text-gray-900">Schedulers Info</h1>

      {schedulersInfoLoading ? (
        <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
      ) : (
        <>
          {unsuccessfullSchedulers.length > 0 && (
            <h1 className="text-red-500">
              {unsuccessfullSchedulers.length} Unsuccessfull Schedulers
            </h1>
          )}
          <div className="text-gray-700 flex flex-col">
            {unsuccessfullSchedulers.map((item) => {
              return (
                <span key={item.id}>
                  {item.name} - {item.status ? item.status : "Status not found"}
                </span>
              );
            })}
          </div>

          <button
            onClick={() => setShowSchedulerInfoModal(true)}
            className="hover:text-white hover:bg-green-600 mt-2 rounded-md px-3 py-1 font-medium text-green-700 bg-green-300"
          >
            View All
          </button>
        </>
      )}

      <Modal
        modalOpen={showSchedulerInfoModal}
        setModalOpen={setShowSchedulerInfoModal}
        hideActionButtons
      >
        <Table
          dataLoading={schedulersInfoLoading}
          // onPaginationApi={getMembers}
          // totalRecords={totalRecords}
          columns={columns}
          // pagination
          dataSource={schedulerInfos}
          // currentPagePagination={currentPagePagination}
        />
      </Modal>
    </div>
  );
};

export default SchedulerInfos;
