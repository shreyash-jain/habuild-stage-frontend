import { useEffect, useState } from "react";
import CustomCalendar from "../../components/CustomCalendar";
import { MembersApis } from "../../constants/apis";
import { format, isFuture, isSunday } from "date-fns";
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
  };

  const handleDateClick = async (
    day,
    dayPresence,
    monthStartDate,
    monthEndDate
  ) => {
    if (
      !window.confirm("Are you sure you want to change member's attendance?")
    ) {
      return;
    }

    setApiLoading(true);

    if (apiLoading) {
      return;
    }

    if (isFuture(day.dateObj) || isSunday(day.dateObj)) {
      toast.error("Cannot update future/sunday dates.");
      setApiLoading(false);
      return;
    }

    const result = await props.customFetch(
      MembersApis.UPDATE_ATTENDANCE(props.member.id),
      "PATCH",
      {
        dates: [day.formatedDate],
        attendanceStatus: !dayPresence ? "PRESENT" : "ABSENT",
      }
    );

    if (!result.ok) {
      toast.error("Failed to update attendance");
    } else {
      toast.success("Updated attendance successfully");
      getAttendance(props.member.id, monthStartDate, monthEndDate);
      props.getCurrentWeekAttendance();
    }

    setApiLoading(false);
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
