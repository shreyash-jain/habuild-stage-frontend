import { useState, useEffect } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Modal from "../../components/Modal";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import FlyoutMenu from "../../components/FlyoutMenu";

import { format, parseISO } from "date-fns";
import { HabuildAdsApis } from "../../constants/apis";

const DemoAds = (props) => {
  const [viewAddModal, setViewAddModal] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [demoAds, setDemoAds] = useState([]);

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setDemoAds(
      props.demoAds?.map((item) => {
        return {
          name: item.name,
          ad_id: item.ad_id,
          action: item,
        };
      })
    );
  }, [props.demoAds?.length]);

  const deleteDemoAd = async (demoAd) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    setDeleteLoading(true);
    const res = await props.customFetch(
      HabuildAdsApis.DELETE(demoAd.id),
      "DELETE",
      {}
    );
    setDeleteLoading(false);
    props.getDemoAds();
    if (res.status == 404) {
      toast.error("Demo Ad Not Deleted.");
    } else {
      toast.success("Demo Ad Deleted.");
    }
  };

  const menuItems = [
    {
      name: "Delete",
      onClick: (actionEntity) => {
        deleteDemoAd(actionEntity);
      },
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Ad id",
      dataIndex: "ad_id",
      key: "ad_id",
    },

    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (actionEntity) => {
        if (deleteLoading) {
          return (
            <RefreshIcon className="text-green animate-spin h-6 w-6 mx-auto" />
          );
        }
        return (
          <FlyoutMenu
            actionEntity={actionEntity}
            menuItems={menuItems}
          ></FlyoutMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Demo Ads</h1>

      <button
        onClick={() => setViewAddModal(true)}
        className="font-medium px-4 py-2 rounded-md bg-green-300 hover:bg-green-500 text-green-700 hover:text-white fixed bottom-2 right-2"
      >
        Add Demo Ad +
      </button>

      <Table columns={columns} dataSource={demoAds ? demoAds : []} />

      <AddDemoAdModal
        refreshData={props.getDemoAds}
        demoProgram={props.demoProgram}
        modalOpen={viewAddModal}
        setModalOpen={setViewAddModal}
      />
    </div>
  );
};

const AddDemoAdModal = (props) => {
  const [name, setName] = useState("");
  const [ad_id, setAdid] = useState("");

  const [apiLoading, setApiLoading] = useState(false);

  const formSubmit = async (e) => {
    e.preventDefault();
    setApiLoading(true);

    if (!name || !ad_id || !props.demoProgram.id) {
      alert("Please enter all details.");
      setApiLoading(false);
      return;
    }

    var raw = {
      name,
      demo_program_id: parseInt(props.demoProgram.id),
      ad_id: parseInt(ad_id),
    };

    try {
      await props.customFetch(HabuildAdsApis.CREATE(), "POST", raw);
      setApiLoading(false);
      props.refreshData();
      props.setModalOpen(false);
      toast.success("Demo Ad Created");
    } catch (err) {
      setApiLoading(false);
      toast.error("Error");
    }
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      hideActionButtons
    >
      <form
        className="flex flex-col w-full space-y-5"
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <h2 className="text-left text-xl font-bold text-gray-900">
          Add Demo Ad for {props.demoProgram?.name}
        </h2>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            placeholder="Name"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            Ad Id
          </label>
          <input
            onChange={(e) => setAdid(e.target.value)}
            type="text"
            name="ad_id"
            id="ad_id"
            placeholder="Ad Id"
            required
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        {/* <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            onChange={(e) => setEndDate(e.target.value)}
            required
            type="date"
            className="mt-1 p-2 text-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div> */}

        <button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
          type="submit"
        >
          Add Demo Ad
          {apiLoading && (
            <RefreshIcon className="text-white animate-spin h-6 w-6 mx-auto" />
          )}
        </button>
      </form>
    </Modal>
  );
};

DemoAds.getLayout = LayoutSidebar;

export default DemoAds;
