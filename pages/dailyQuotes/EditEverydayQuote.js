import Modal from "../../components/Modal";
import { RefreshIcon, TrashIcon, PlusIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { useEffect, useState, Fragment } from "react";
import { DailyQuotesApis } from "../../constants/apis";

const EditEverydayQuote = (props) => {
  const [apiLoading, setApiLoading] = useState(false);

  console.log("Props EfitEveryDayQuote", props);

  const formFDields = [
    
  ]

  return (
    <div>
      <Modal
        apiLoading={apiLoading}
        modalOpen={props.viewModal || false}
        setModalOpen={props.setViewModal}
        hideActionButtons
      >
        <div className="flex flex-col">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Day Number
            </label>
            <input
              //   value={item.highlight}
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
        </div>
      </Modal>
    </div>
  );
};

export default EditEverydayQuote;
