import Modal from "../../components/Modal";
import { RefreshIcon, TrashIcon, PlusIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { useEffect, useState, Fragment } from "react";
import { DailyQuotesApis } from "../../constants/apis";

const DailyQuoteFormModal = (props) => {
  const [apiLoading, setApiLoading] = useState(false);

  const [quoteFormArray, setQuoteFormArray] = useState([
    {
      dayNumber: "",
      date: "",
      demo_batch_id: "",
      highlight: "",
      highlight_2: "",
      program_id: "",
      quote_1: "",
      quote_2: "",
      quote_3: "",
      status: "",
      tip: "",
      morning_message: "",
    },
  ]);

  useEffect(() => {
    if (props.editQuote) {
      if (props.mode == "edit") {
        const newArr = [
          {
            dayNumber: props.editQuote.day_id,
            date: props.editQuote?.date?.split("T")[0],
            demo_batch_id: props.editQuote.demo_batch_id,
            highlight: props.editQuote.highlight,
            highlight_2: props.editQuote.highlight_2,
            program_id: props.editQuote.program_id,
            quote_1: props.editQuote.quote_1,
            quote_2: props.editQuote.quote_2,
            quote_3: props.editQuote.quote_3,
            status: props.editQuote.status,
            tip: props.editQuote.tip,
            morning_message: props.editQuote.morning_message,
          },
        ];

        setQuoteFormArray(newArr);
      }
    }
  }, [props.editQuote]);

  const handleQuoteFormChange = (fieldName, index, value) => {
    const newArr = [...quoteFormArray];

    newArr[index][fieldName] = value;

    setQuoteFormArray(newArr);
  };

  const formSubmit = async (e) => {
    let API = DailyQuotesApis.CREATE();
    let method = "POST";

    if (props.mode == "edit") {
      API = DailyQuotesApis.UPDATE(props.editQuote.id);
      method = "PATCH";
    }

    e.preventDefault();
    setApiLoading(true);

    for (let i = 0; i < quoteFormArray.length; i++) {
      const item = quoteFormArray[i];

      if (
        !item.dayNumber ||
        !item.highlight ||
        !item.highlight_2 ||
        !item.quote_1 ||
        !item.quote_2 ||
        !item.quote_3 ||
        !item.status ||
        !item.tip
      ) {
        alert("Please enter all details.");
        setApiLoading(false);
        return;
      }

      var raw = {
        day_id: item.dayNumber,
        date: item.date + " 01:00:00",
        highlight: item.highlight,
        highlight_2: item.highlight_2,
        quote_1: item.quote_1,
        quote_2: item.quote_2,
        quote_3: item.quote_3,
        status: item.status,
        tip: item.tip,
        program_id: item.program_id,
        demo_batch_id: item.demo_batch_id,
      };

      // console.log(raw);
      // console.log(API);
      // console.log(method);

      try {
        const data = await props.customFetch(API, method, raw);

        setApiLoading(false);
        toast.success(
          `Daily Quote ${props.mode == "edit" ? "Updated" : "Created"}`
        );
        // props.getQuotes();
        // props.setViewModal(false);
        // console.log("Api Result", result);
      } catch (error) {
        setApiLoading(false);
        toast.error(`Error ${JSON.stringify(error)}`);
        console.log("error", error);
      }
      props.getQuotes();
      props.setViewModal(false);
    }
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.viewModal || false}
      setModalOpen={props.setViewModal}
      hideActionButtons
    >
      <h2 className="text-left text-xl font-bold text-gray-900">
        {props.mode == "edit" ? "Edit" : "Add"} Quote
      </h2>
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        {quoteFormArray.length > 0 &&
          quoteFormArray?.map((item, index) => {
            return (
              <div className="grid grid-cols-10 space-x-2 mb-4" key={index}>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Day Number
                  </label>
                  {/* <input
                    value={item.date}
                    onChange={(e) =>
                      handleQuoteFormChange("date", index, e.target.value)
                    }
                    type="date"
                    name="date"
                    id="date"
                    placeholder="Date"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  /> */}
                  <input
                    value={item.dayNumber}
                    onChange={(e) =>
                      handleQuoteFormChange("dayNumber", index, e.target.value)
                    }
                    type="number"
                    min={1}
                    placeholder="Day Number"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlight
                  </label>
                  <input
                    value={item.highlight}
                    onChange={(e) =>
                      handleQuoteFormChange("highlight", index, e.target.value)
                    }
                    type="text"
                    name="highlight"
                    id="highlight"
                    placeholder="Highlight"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlight 2
                  </label>
                  <input
                    value={item.highlight_2}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "highlight_2",
                        index,
                        e.target.value
                      )
                    }
                    type="text"
                    name="highlight_2"
                    id="highlight_2"
                    placeholder="Highlight 2"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Quote 1
                  </label>
                  <input
                    value={item.quote_1}
                    onChange={(e) =>
                      handleQuoteFormChange("quote_1", index, e.target.value)
                    }
                    type="text"
                    placeholder="Quote 1"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Quote 2
                  </label>
                  <input
                    value={item.quote_2}
                    onChange={(e) =>
                      handleQuoteFormChange("quote_2", index, e.target.value)
                    }
                    type="text"
                    placeholder="Quote 3"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Quote 3
                  </label>
                  <input
                    value={item.quote_3}
                    onChange={(e) =>
                      handleQuoteFormChange("quote_3", index, e.target.value)
                    }
                    type="text"
                    placeholder="Quote 3"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <input
                    value={item.status}
                    onChange={(e) =>
                      handleQuoteFormChange("status", index, e.target.value)
                    }
                    type="text"
                    placeholder="Status"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Tip
                  </label>
                  <input
                    value={item.tip}
                    onChange={(e) =>
                      handleQuoteFormChange("tip", index, e.target.value)
                    }
                    type="text"
                    placeholder="Tip"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Morning Message
                  </label>
                  <input
                    value={item.morning_message}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "morning_message",
                        index,
                        e.target.value
                      )
                    }
                    type="text"
                    placeholder="Morning Message"
                    className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>

                {/* <div className="col-span-1 ">
                  <label
                    htmlFor="program"
                    className="block text-md font-medium text-gray-700"
                  >
                    Associated Program
                  </label>

                  <select
                    value={item.program_id}
                    onChange={(e) =>
                      handleQuoteFormChange("program_id", index, e.target.value)
                    }
                    className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
                  >
                    <option></option>
                    {props.programs.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      );
                    })}
                  </select>
                </div> */}

                {/* <div className="col-span-1 ">
                  <label
                    htmlFor="program"
                    className="block text-md font-medium text-gray-700"
                  >
                    Associated Demo Batch
                  </label>

                  <select
                    value={item.demo_batch_id}
                    onChange={(e) =>
                      handleQuoteFormChange(
                        "demo_batch_id",
                        index,
                        e.target.value
                      )
                    }
                    className="p-2 mt-1 block w-full shadow-sm border border-gray-200 rounded-md"
                  >
                    <option></option>
                    {props.demoBatches.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div> */}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const newArr = [...quoteFormArray];

                    newArr.splice(index, 1);

                    setQuoteFormArray(newArr);
                  }}
                  className="w-4"
                  title="Delete Quote"
                >
                  <TrashIcon className="font-medium text-red-200 h-4 w-4 hover:text-red-400" />
                </button>
              </div>
            );
          })}
        {props.mode !== "edit" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              const newArr = [...quoteFormArray];
              newArr.push({
                total_days_absent: "",
                total_days_present: "",
                day_presence: "",
                message: "",
                status: "",
                program_id: "",
                demo_batch_id: "",
              });
              setQuoteFormArray(newArr);
            }}
            className="mt-4 max-w-fit mb-4 font-medium text-gray-500 bg-gray-200 hover:bg-gray-400 hover:text-white py-2 px-4 rounded-md"
          >
            <PlusIcon className="h-4 w-4 mx-auto" />
          </button>
        )}

        <button
          type="submit"
          className="-mb-4 max-w-fit flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
        >
          {props.mode == "edit" ? "Edit" : "Add"} Quote
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

export default DailyQuoteFormModal;
