import React, { useEffect, useState, Fragment } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import { UserApis } from "../../constants/apis";
import useCheckAuth from "../../hooks/useCheckAuth";
import { useFetchWrapper } from "../../utils/apiCall";
import { startOfWeek, isFuture } from "date-fns";
import toast from "react-hot-toast";

const userActions = () => {
  const checkAuthLoading = useCheckAuth(false);

  const { customFetch, customFetchFile } = useFetchWrapper();

  const [userActions, setUserActions] = useState([]);
  const [startDate, setStartDate] = useState(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (!checkAuthLoading) {
      getUserActions();
    }
  }, [checkAuthLoading]);

  const getUserActions = async () => {
    const result = await customFetch(
      UserApis.GET_ALL_ACTIONS(startDate, endDate),
      "GET",
      {}
    );

    console.log("Result", result);
    setUserActions(result.result);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action Performed",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Member Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Member ID",
      dataIndex: "member_id",
      key: "member_id",
    },
    {
      title: "Request Payload",
      dataIndex: "request_payload",
      key: "request_payload",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">User Actions</h1>

      <div className="flex flex-row space-x-4 mt-8">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Start Date
          </label>
          <input
            value={startDate}
            className="p-2 border rounded-md bprder-gray-200"
            type={"date"}
            onChange={(e) => {
              if (!isFuture(new Date(e.target.value))) {
                setStartDate(e.target.value);
              } else {
                toast.error("Cannot select future date");
              }
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">
            End Date
          </label>
          <input
            value={endDate}
            className="p-2 border rounded-md bprder-gray-200"
            type={"date"}
            onChange={(e) => {
              if (!isFuture(new Date(e.target.value))) {
                setEndDate(e.target.value);
              } else {
                toast.error("Cannot select future date");
              }
            }}
          />
        </div>

        <button
          onClick={() => {
            getUserActions();
          }}
          className="rounded-md px-3 py-1 bg-green-300 font-medium text-green-700 hover:bg-green-600 hover:text-white"
        >
          Get Actions
        </button>
      </div>

      <Table columns={columns} dataSource={userActions} />
    </div>
  );
};

userActions.getLayout = LayoutSidebar;

export default userActions;
