import SidePannel from "../../components/SidePannel";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  CogIcon,
  HomeIcon,
  MapIcon,
  MenuIcon,
  SearchCircleIcon,
  SpeakerphoneIcon,
  UserGroupIcon,
  ViewGridAddIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  ChevronLeftIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { format } from "date-fns";
import Link from "next/link";

const tabs = [
  { name: "Account", href: "#", current: true },
  { name: "Performance", href: "#", current: false },
  { name: "Subscription", href: "#", current: false },
];

// const profile = {
//   name: "Ricardo Cooper",
//   imageUrl:
//     "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   coverImageUrl:
//     "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
//   about: `
//     <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
//     <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
//   `,
//   fields: {
//     Phone: "(555) 123-4567",
//     Email: "ricardocooper@example.com",
//     Title: "Senior Front-End Developer",
//     Team: "Product Development",
//     Location: "San Francisco",
//     Sits: "Oasis, 4th floor",
//     Salary: "$145,000",
//     Birthday: "June 8, 1990",
//   },
// };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CalcDaysToDate(fromDate, toDate) {
  const startDate = new Date(fromDate).getTime();
  const endDate = new Date(toDate).getTime();
  const timeDiff = Math.abs(endDate - startDate);
  const dayDiff = parseInt(timeDiff / (1000 * 60 * 60 * 24));
  return dayDiff;
}

const MemberInfoSidePanel = (props) => {
  console.log("Props", props);
  const [profile, setProfile] = useState({
    Account: {},
    Performance: {},
    Subscription: {},
  });
  const [currentTab, setCurrentTab] = useState("Account");

  useEffect(() => {
    const memberPerformance =
      props.memberForAction.habuild_member_performance &&
      props.memberForAction.habuild_member_performance[0];

    setProfile({
      name: props.memberForAction.name,
      Account: {
        "Member Id": props.memberForAction.id,
        Name: props.memberForAction.name,
        "Phone No.": props.memberForAction.mobile_number,
        Email: props.memberForAction.email,
        "Short Link": props.memberForAction.short_meeting_link,
        "Lead Source": props.memberForAction.lead_source,
        Status: props.memberForAction.status,
        "Payment Status": props.memberForAction.payment_status,
        "Pause Days": props.memberForAction.total_pause_days,
        "Pause Days": props.memberForAction.total_pause_days,
        "Meeting id 1 Link":
          props.memberForAction.habuild_member_batches &&
          props.memberForAction.habuild_member_batches[0]?.meet_link,
        "Meeting id 2 Link":
          props.memberForAction.habuild_member_batches &&
          props.memberForAction.habuild_member_batches[1]?.meet_link,
        "Meeting id 3 Link":
          props.memberForAction.habuild_member_batches &&
          props.memberForAction.habuild_member_batches[2]?.meet_link,
        "Meeting id 4 Link":
          props.memberForAction.habuild_member_batches &&
          props.memberForAction.habuild_member_batches[3]?.meet_link,
      },
      Performance: {
        "Total Days":
          memberPerformance?.total_absent_days +
          memberPerformance?.total_active_days,
        "Total Attended Days": memberPerformance?.total_active_days,
        "Total Absent Days": memberPerformance?.total_absent_days,
        "Streak Leaves": memberPerformance?.streak_leaves,
        "Total Active Week": memberPerformance?.total_active_weeks,
      },
      Subscription: {
        "Member Since Date":
          props.memberForAction.member_since_date?.split("T")[0],
        "Current Preffered Batch ID": props.memberForAction.preffered_batch_id,
        "Subscription End Date":
          props.memberForAction.sub_end_date?.split("T")[0],
        "Current Subscription": "",
        "Days Remaining":
          props.memberForAction?.sub_end_date &&
          CalcDaysToDate(new Date(), props.memberForAction?.sub_end_date),
      },
    });
  }, [props.memberForAction]);

  return (
    <SidePannel
      width="max-w-2xl"
      title="Member Detail"
      isOpen={props.open || false}
      setIsOpen={props.setOpen}
    >
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
        <article>
          {/* Profile header */}
          <div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-end sm:space-x-5">
                <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      {profile.name}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {profile.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 sm:mt-2 2xl:mt-5">
            <div className="border-b border-gray-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <span
                      onClick={() => setCurrentTab(tab.name)}
                      key={tab.name}
                      className={classNames(
                        currentTab == tab.name
                          ? "border-pink-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
                      )}
                    >
                      {tab.name}
                    </span>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Description list */}
          <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-4">
              {Object.keys(profile[currentTab]).map((field) => {
                if (field.includes("Meeting")) {
                  return (
                    <div key={field} className="sm:col-span-4">
                      <dt className="text-sm font-medium text-gray-500">
                        {field}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <Link
                          href={
                            profile[currentTab][field]
                              ? profile[currentTab][field]
                              : ""
                          }
                        >
                          <a
                            style={{
                              textDecoration: "underline",
                              color: "blue",
                            }}
                          >
                            {profile[currentTab][field]}
                          </a>
                        </Link>
                      </dd>
                    </div>
                  );
                }

                return (
                  <div key={field} className="sm:col-span-4">
                    <dt className="text-sm font-medium text-gray-500">
                      {field}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile[currentTab][field]}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* Team member list */}
          {/* <div className="mt-8 max-w-5xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
            <h2 className="text-sm font-medium text-gray-500">Team members</h2>
            <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {team.map((person) => (
                <div
                  key={person.handle}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={person.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {person.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {person.role}
                      </p>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </article>

        <div className="mt-6 ">
          <h1>ShortLink Info</h1>
        </div>
      </main>
    </SidePannel>
  );
};

export default MemberInfoSidePanel;
