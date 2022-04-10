import { useEffect, useState, Fragment } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import LayoutSidebar from "../components/LayoutSidebar";
import Table from "../components/Table";
import FlyoutMenu from "../components/FlyoutMenu";
import Modal from "../components/Modal";
import {
  RefreshIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

const Members = (props) => {
  const columns = [
    {
      title: "",
      dataIndex: "isSelected",
      key: "isSelected",
      renderHeader: true,
      headerRender: () => {
        return (
          <input
            // onChange={(e) => handleSelectAll(e.target.checked)}
            className="mt-1 h-4 w-4 rounded-md border-gray-300 "
            type="checkbox"
          />
        );
      },
      render: (isSelected) => {
        return (
          <input
            // onChange={(e) => handleSelect(isSelected.identifier)}
            className="mt-1 h-4 w-4 rounded-md border-gray-300 "
            type="checkbox"
            // checked={isSelected.value}
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (lead) => {
        return <FlyoutMenu menuItems={[]}></FlyoutMenu>;
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Members</h1>

      <div className="min-w-0 flex-1 md:px-4 lg:px-0 xl:col-span-6">
        <div className="flex items-center py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                id="search"
                name="search"
                className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search Member by Phone number, name or email."
                type="search"
              />
            </div>
            {/* {searchTerm && (
              <>
                <button
                //   onClick={handleSearch}
                  className="font-medium px-4 py-2 rounded-md bg-white border-2 border-green-400 hover:bg-green-400 text-green-700 hover:text-white mt-2"
                >
                  Search
                </button>
                <button
                //   onClick={handleSearchCancel}
                  className="ml-2 font-medium px-4 py-2 rounded-md bg-white border-2 border-red-400 hover:bg-red-400 text-red-700 hover:text-white mt-2"
                >
                  Cancel
                </button>
              </>
            )} */}
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full mt-8 justify-between">
        <Disclosure
          as="section"
          aria-labelledby="filter-heading"
          className="relative z-10  grid items-center"
        >
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>
          <div className="relative col-start-1 row-start-1 py-4">
            <div className="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
              <div>
                <Disclosure.Button className="group text-gray-700 font-medium flex items-center py-1">
                  <FilterIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {/* {Object.keys(filterParams).length} Filters */}
                </Disclosure.Button>
              </div>
              <div className="pl-6">
                {/* {Object.keys(filterParams).length > 0 && (
                  <>
                    <button
                    //   onClick={() => getPaginatedLeads(1)}
                      type="button"
                      className="border-2 border-green-300 rounded-md px-2 py-1 hover:bg-green-300 hover:text-white text-gray-500"
                    >
                      Filter
                    </button>
                    <button
                      onClick={() => {
                        // setFilterParams({});
                        // getPaginatedLeads(1);
                      }}
                      type="button"
                      className="ml-2 hover:text-gray-700 text-gray-500"
                    >
                      Clear all
                    </button>
                  </>
                )} */}
              </div>
            </div>
          </div>
          <Disclosure.Panel className="border-t border-gray-200 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Batch</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {/* {demoBatches.map((option, optionIdx) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={option.id}
                          name="batch"
                          type="radio"
                          checked={filterParams.batchId == option.id}
                          value={option.name}
                          onChange={() =>
                            setFilterParams({
                              ...filterParams,
                              batchId: option.id,
                            })
                          }
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor={option.id}
                          className="ml-3 block text-sm text-gray-700"
                        >
                          {option.name}
                        </label>
                      </div>
                    ))} */}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Status</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {/* {filters.status.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={option.value}
                          onChange={() =>
                            setFilterParams({
                              ...filterParams,
                              status: option.value,
                            })
                          }
                          checked={filterParams.status == option.value}
                          name="status"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className="ml-3 block text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))} */}
                  </div>
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Source</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {/* {filters.source.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={option.value}
                          onChange={() =>
                            setFilterParams({
                              ...filterParams,
                              source: option.value,
                            })
                          }
                          checked={filterParams.source == option.value}
                          name="source"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className="ml-3 block text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))} */}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Lead Date</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {/* {filters.leadDate.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={option.value}
                          onChange={() =>
                            setFilterParams({
                              ...filterParams,
                              leadDate: option.value,
                            })
                          }
                          checked={filterParams.leadDate == option.value}
                          name="leadDate"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className="ml-3 block text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))} */}
                  </div>
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Paid</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {/* {filters.paid.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={option.value}
                          onChange={() =>
                            setFilterParams({
                              ...filterParams,
                              paid: option.value,
                            })
                          }
                          checked={filterParams.paid == option.value}
                          name="paid"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className="ml-3 block text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))} */}
                  </div>
                </fieldset>
              </div>
            </div>
          </Disclosure.Panel>
        </Disclosure>

        <div className="flex-end space-x-2">
          <button
            // onClick={() => setViewSendWAModal(true)}
            className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white "
          >
            Send WA Message
          </button>
          <button
            // onClick={() => setViewStopWACommModal(true)}
            className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white"
          >
            Stop WA Communication
          </button>
        </div>
      </div>

      <Table
        // handlePaginationClick={getPaginatedLeads}
        columns={columns}
        pagination
        dataSource={[{}]}
      />

      <button
        // onClick={() => setViewAddLeadModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Member +
      </button>
    </div>
  );
};

Members.getLayout = LayoutSidebar;

export default Members;