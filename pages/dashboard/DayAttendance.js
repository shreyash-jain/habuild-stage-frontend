import { useEffect, useState } from "react";
import { HabuildAttendance } from "../../constants/apis";
import { eachDayOfInterval, format } from "date-fns";
import { RefreshIcon } from "@heroicons/react/outline";
import { ArrowCircleRightIcon } from "@heroicons/react/solid";

const DayAttendance = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [datesArr, setDatesArr] = useState([]);
  const [morningAtt, setMorningAtt] = useState([]);
  const [eveningAtt, setEveningAtt] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMorningAttendance(new Date(), new Date());
    getEveningAttendance(new Date(), new Date());
    generateDays(new Date(), new Date());
  }, []);

  const getMorningAttendance = (startDate, endDate) => {
    setLoading(true);
    fetch(HabuildAttendance.GET_MORNING_ATT(startDate, endDate))
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setLoading(false);
        setMorningAtt(data.result);
      });
  };

  const getEveningAttendance = (startDate, endDate) => {
    setLoading(true);

    fetch(HabuildAttendance.GET_EVENING_ATT(startDate, endDate))
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setLoading(false);
        setEveningAtt(data.result);
      });
  };

  const generateDays = (startDate, endDate) => {
    const dates = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });

    setDatesArr(dates);
  };

  if (loading) {
    return (
      <div className="rounded-md p-4 shadow-md border border-gray-100 max-w-fit mt-8 space-y-4">
        <h1 className="text-lg font-medium text-gray-900">Day Attendance</h1>

        <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="rounded-md p-4 shadow-md border border-gray-100 max-w-fit mt-8 space-y-4">
      <h1 className="text-lg font-medium text-gray-900">Day Attendance</h1>

      <div className="flex flex-row space-x-4">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Start Date
          </label>
          <input
            className="p-2 border rounded-md bprder-gray-200"
            type={"date"}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">
            End Date
          </label>
          <input
            className="p-2 border rounded-md bprder-gray-200"
            type={"date"}
            pattern=""
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        {morningAtt?.length > 0 && (
          <div className="flex flex-col">
            <h1 className="font-medium text-gray-700">Morning Attendance</h1>
            {datesArr &&
              datesArr.map((item, index) => {
                return (
                  <div key={index} className="flex flex-row items-center">
                    <span className="text-gray-800">
                      {format(item, "dd-MM-yyyy")}
                    </span>
                    <ArrowCircleRightIcon className="text-green-300 h-5 w-5" />
                    {morningAtt[index]}
                  </div>
                );
              })}
          </div>
        )}

        {eveningAtt?.length > 0 && (
          <div className="flex flex-col">
            <h1 className="font-medium text-gray-700">Evening Attendance</h1>
            {datesArr &&
              datesArr.map((item, index) => {
                return (
                  <div key={index} className="flex flex-row items-center">
                    <span className="text-gray-800">
                      {format(item, "dd-MM-yyyy")}
                    </span>
                    <ArrowCircleRightIcon className="text-green-300 h-5 w-5" />
                    {eveningAtt[index]}
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <button
        onClick={() => {
          generateDays(startDate, endDate);
          getMorningAttendance(startDate, endDate);
          getEveningAttendance(startDate, endDate);
        }}
        className="rounded-md px-3 py-1 bg-green-300 font-medium text-green-700 hover:bg-green-600 hover:text-white"
      >
        Get Attendance
      </button>
    </div>
  );
};

export default DayAttendance;
