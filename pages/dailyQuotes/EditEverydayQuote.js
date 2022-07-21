import Modal from "../../components/Modal";
import { RefreshIcon, TrashIcon, PlusIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { useEffect, useState, Fragment } from "react";
import { DailyQuotesApis } from "../../constants/apis";

const EditEverydayQuote = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [quoteObj, setQuoteObj] = useState({ id: "" });

  // console.log("Props EfitEveryDayQuote", quoteObj);

  useEffect(() => {
    setQuoteObj(props.editQuote);
  }, [props.editQuote.id]);

  const formSubmit = (e) => {
    let method = "PATCH";

    e.preventDefault();
    setApiLoading(true);
    // if (
    //   !item.day_id ||
    //   !item.highlight ||
    //   !item.highlight_2 ||
    //   !item.quote_1 ||
    //   !item.quote_2 ||
    //   !item.quote_3 ||
    //   !item.status ||
    //   !item.tip ||
    //   !item.morning_message
    // ) {
    //   alert("Please enter all details.");
    //   setApiLoading(false);
    //   return;
    // }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      day_id: quoteObj.day_id,
      date: quoteObj.date + " 01:00:00",
      highlight: quoteObj.highlight,
      highlight_2: quoteObj.highlight_2,
      quote_1: quoteObj.quote_1,
      quote_2: quoteObj.quote_2,
      quote_3: quoteObj.quote_3,
      status: quoteObj.status,
      tip: quoteObj.tip,
      program_id: quoteObj.program_id,
      demo_batch_id: quoteObj.demo_batch_id,
      morning_message: quoteObj.morning_message,
    });
    var requestOptions = {
      method: method,
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // console.log(raw);
    // console.log(API);
    // console.log(method);

    try {
      fetch(DailyQuotesApis.UPDATE(quoteObj?.id), requestOptions)
        .then((response) => {
          // console.log("response", response);
          return response.text();
        })
        .then((result) => {
          setApiLoading(false);
          toast.success(`Updated`);
          props.getQuotes();
          props.setViewModal(false);
        });
    } catch {
      (error) => {
        setApiLoading(false);
        toast.error(`Updated Failed`);
        // console.log("error", error);
      };
    }
  };

  if (props.calledFrom() == "morningTab") {
    return (
      <div>
        <Modal
          apiLoading={apiLoading}
          modalOpen={props.viewModal || false}
          setModalOpen={props.setViewModal}
          actionText="Update"
          onActionButtonClick={formSubmit}
          // hideActionButtons
        >
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Day Number
              </label>
              <input
                value={quoteObj.day_id}
                //   onChange={(e) =>
                //     handleQuoteFormChange("highlight", index, e.target.value)
                //   }
                name="day_id"
                id="day_id"
                type="number"
                min="0"
                placeholder="Day Number"
                className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Morning Message
              </label>
              <textarea
                value={quoteObj.morning_message}
                // onChange={(e) =>
                //   handleQuoteFormChange("quote_1", index, e.target.value)
                // }
                rows={4}
                type="text"
                placeholder="Morning Message"
                className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <Modal
        apiLoading={apiLoading}
        modalOpen={props.viewModal || false}
        setModalOpen={props.setViewModal}
        actionText="Update"
        onActionButtonClick={formSubmit}
        // hideActionButtons
      >
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Day Number
            </label>
            <input
              value={quoteObj.day_id}
              onChange={(e) =>
                setQuoteObj({
                  ...quoteObj,
                  day_id: e.target.value,
                })
              }
              name="day_id"
              id="day_id"
              type="number"
              min="0"
              placeholder="Day Number"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quote 1
            </label>
            <textarea
              value={quoteObj.quote_1}
              onChange={(e) =>
                setQuoteObj({ ...quoteObj, quote_1: e.target.value })
              }
              rows={4}
              type="text"
              placeholder="Quote 1"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quote 2
            </label>
            <textarea
              value={quoteObj.quote_2}
              onChange={(e) =>
                setQuoteObj({ ...quoteObj, quote_2: e.target.value })
              }
              rows={4}
              type="text"
              placeholder="Quote 3"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quote 3
            </label>
            <textarea
              value={quoteObj.quote_3}
              onChange={(e) =>
                setQuoteObj({ ...quoteObj, quote_3: e.target.value })
              }
              rows={4}
              type="text"
              placeholder="Quote 3"
              className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditEverydayQuote;
