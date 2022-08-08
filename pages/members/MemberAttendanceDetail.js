import { useEffect, useState } from "react";
import CustomCalendar from "../../components/CustomCalendar";
import { MembersApis } from "../../constants/apis";
import { format } from "date-fns";
import toast from "react-hot-toast";

const MemberAttendanceDetail = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [currentMonthAttendance, setCurrentMonthAttendance] = useState([]);

  const getAttendance = async (memberId, startDate, endDate) => {
    setApiLoading(true);
    const result = await props.customFetch(
      MembersApis.GET_DATE_RANGE_ATTENDANCE(
        memberId,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      ),
      "GET",
      {}
    );

    if (!result.ok) {
      toast.error("Failed to fetch Attendance");
      setApiLoading(false);
    } else {
      setApiLoading(false);

      const attendedDates = [];
      for (let i = 0; i < result.data.length; i++) {
        attendedDates.push(result.data[i].createdAt.utc);
      }

      setCurrentMonthAttendance(attendedDates);
    }

    console.log("------Get Att Result------", result);
  };

  const handleDateClick = (day) => {
    console.log("day Clicked ", day);
  };

  return (
    <div>
      <CustomCalendar
        setLoading={setApiLoading}
        loading={apiLoading}
        member={props.member}
        handleDateClick={handleDateClick}
        onMonthChangeEffect={getAttendance}
        datesToHighlight={currentMonthAttendance}
      />
    </div>
  );
};

export default MemberAttendanceDetail;
