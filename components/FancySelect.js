import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

const publishingOptions = [
  {
    title: "Published",
    description: "This job posting can be viewed by anyone who has the link.",
    current: true,
  },
  {
    title: "Draft",
    description: "This job posting will no longer be publicly accessible.",
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FancySelect(props) {
  const [selected, setSelected] = useState({ title: "" });

  const [publishingOptions, setPublishingOptions] = useState(
    props.templateOptions.map((item) => {
      return {
        title: item.identifier,
        description: item.body,
        current: false,
        dbObj: item,
      };
    })
  );

  useEffect(() => {
    props.parentOnchange(selected);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            Select Wati Template
          </Listbox.Label>
          <div className="relative">
            <div className="inline-flex shadow-sm rounded-md divide-x divide-green-600">
              <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-green-600">
                <div className="relative inline-flex items-center bg-green-500 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  <p className="ml-2.5 text-sm font-medium">{selected.title}</p>
                </div>
                <Listbox.Button className="relative inline-flex items-center bg-green-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500">
                  <ChevronDownIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="origin-top-right absolute z-10 mt-2 w-72 rounded-md shadow-lg overflow-scroll h-96 bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
                {publishingOptions.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-green-500" : "text-gray-900",
                        "cursor-default select-none relative p-4 text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
                            {option.title}
                          </p>
                          {selected ? (
                            <span
                              className={
                                active ? "text-white" : "text-green-500"
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={classNames(
                            active ? "text-green-200" : "text-gray-500",
                            "mt-2"
                          )}
                        >
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
