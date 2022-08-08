import { RefreshIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  getDaysInMonth,
  eachDayOfInterval,
  getYear,
  getMonth,
  format,
  isToday,
  isThisMonth,
  getDay,
  isEqual,
  isPast,
  isFuture,
  parseISO,
  isSameDay,
  isSunday,
} from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function generateMonthDaysArray(year, month, daysInMonth) {
  const startMonthDate = new Date(year, month, 1);
  const endMonthDate = new Date(year, month, daysInMonth);

  return eachDayOfInterval({
    start: startMonthDate,
    end: endMonthDate,
  });
}

//NOTE - January is 0 not 1

const CustomCalendar = (props) => {
  const [days, setDays] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [currentMonthNum, setCurrentMonthNum] = useState(0);
  const [inputMonthVal, setInputMonthVal] = useState(0);

  const populateMonthDaysArr = (month) => {
    const daysInMonth = getDaysInMonth(new Date());
    const currentYear = getYear(new Date());

    const currentMonthDates = generateMonthDaysArray(
      currentYear,
      month,
      daysInMonth
    );

    return currentMonthDates.map((item) => {
      return {
        dateObj: item,
        isCurrentMonth: isThisMonth(item),
        dayOfWeek: format(item, "E"),
        formatedDate: format(item, "yyyy-MM-dd"),
        isToday: isToday(item),
        isSelected: false,
        numDayOfWeek: getDay(item) == 0 ? 7 : getDay(item),
      };
    });
  };

  useEffect(() => {
    const currentMonthNum = getMonth(new Date());

    changeMonth(currentMonthNum, new Date());
  }, []);

  const changeMonth = (monthNum, dateToExtractMonthFrom) => {
    const days = populateMonthDaysArr(monthNum);

    let dateToUse;

    if (dateToExtractMonthFrom) {
      dateToUse = dateToExtractMonthFrom;
    } else {
      dateToUse = days[0].dateObj;
    }

    setCurrentMonthNum(monthNum);
    setCurrentMonthYear(
      format(dateToUse, "LLLL") + ", " + format(dateToUse, "yyyy")
    );
    setInputMonthVal(format(dateToUse, "yyyy-MM"));
    setDays(days);
    if (props.member.id) {
      props.onMonthChangeEffect(
        props.member.id,
        days[0].dateObj,
        days[days.length - 1].dateObj
      );
    }
  };

  const handleNextArrowClick = () => {
    changeMonth(currentMonthNum + 1, null);
  };

  const handlePrevArrowClick = () => {
    changeMonth(currentMonthNum - 1, null);
  };

  if (props.loading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-md shadow-md">
        {!props.disableHeader && (
          <div className="flex items-center">
            <div className="flex-auto">
              <input
                onChange={(e) => {
                  const newMonthNum = Number(e.target.value.split("-")[1]);
                  changeMonth(newMonthNum - 1, null);
                }}
                value={inputMonthVal}
                type="month"
                className="p-2 border border-gray-200 rounded-md max-w-fit font-bold text-grey-900"
              />
            </div>
            <button
              onClick={handlePrevArrowClick}
              type="button"
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleNextArrowClick}
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => {
            let dayPresent = false;

            for (let i = 0; i < props.datesToHighlight.length; i++) {
              if (isSameDay(day.dateObj, parseISO(props.datesToHighlight[i]))) {
                dayPresent = true;
                break;
              }
            }

            return (
              <div
                style={{ gridColumn: `${day.numDayOfWeek} / span 1` }}
                key={day.formatedDate}
                className={classNames(
                  dayIdx > 6 && "border-t border-gray-200",
                  "py-2"
                )}
              >
                <button
                  disabled={props.disableClick}
                  // onClick={() => handleDateSelect(day)}
                  onClick={() => props.handleDateClick(day)}
                  type="button"
                  className={classNames(
                    dayPresent ? "bg-green-300" : "bg-red-300",
                    isSunday(day.dateObj) && "bg-gray-200",
                    isFuture(day.dateObj) && "bg-white",
                    "mx-auto font-medium flex h-8 w-8 items-center justify-center rounded-full"
                  )}
                >
                  <time dateTime={day.formatedDate}>
                    {day.formatedDate.split("-").pop().replace(/^0/, "")}
                  </time>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CustomCalendar;
