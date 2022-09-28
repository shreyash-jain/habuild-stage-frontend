import { useEffect, useState } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import useCheckAuth from "../../hooks/useCheckAuth";
import { useFetchWrapper } from "../../utils/apiCall";
import { isValidHttpUrl } from "../../utils/stringUtility";
import { RefreshIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { ShortenerApis } from "../../constants/apis";
import Table from "../../components/Table";
import UpdateCustomShortlinkModal from "./UpdateCustomShortlinkModal";

const CustomShortlinks = () => {
  const { checkAuthLoading, customFetch, user } = useFetchWrapper();

  const [createShortLinkLoading, setCreateShortLinkLoading] = useState(false);
  const [shortRouteName, setShortRouteName] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [shortLinks, setShortLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewUpdateModal, setViewUpdateModal] = useState(false);
  const [customShortlinkObjToUpdate, setCustomShortlinkObjToUpdate] = useState(
    {}
  );

  useEffect(() => {
    if (!checkAuthLoading) {
      getAllCustomShortlinks();
    }
  }, [checkAuthLoading]);

  const getAllCustomShortlinks = async () => {
    setLoading(true);

    const result = await customFetch(
      ShortenerApis.GET_CUSTOM_SHORT_LINKS(),
      "GET",
      {}
    );

    if (!result.ok) {
      toast.error("Failed to fetch Custom Urls");
    } else {
      setShortLinks(
        result.result.map((item) => {
          return {
            ...item,
            action: item,
          };
        })
      );
    }

    setLoading(false);
  };

  const createNewShortLink = async () => {
    setCreateShortLinkLoading(true);

    if (!shortRouteName || !longUrl) {
      toast.error("short route or long url missing");
      setCreateShortLinkLoading(false);
      return;
    }

    if (!isValidHttpUrl(longUrl)) {
      alert("Please enter valid long url!");
      setCreateShortLinkLoading(false);
      return;
    }

    const result = await customFetch(
      ShortenerApis.CREATE_SHORT_LINK(),
      "POST",
      {
        shortRoute: shortRouteName,
        longUrl,
      }
    );

    if (result.ok) {
      toast.success(
        `Short url created -> ${result.data.short_url} - ${longUrl}`
      );
    } else {
      toast.error(
        result.error ? result.error : "Failed to create new shortlink"
      );
    }
    setCreateShortLinkLoading(false);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Base URL",
      dataIndex: "base_url",
      key: "base_url",
    },
    {
      title: "Short Route",
      dataIndex: "short_route",
      key: "short_route",
    },
    {
      title: "Long URL",
      dataIndex: "long_url",
      key: "long_url",
    },
    {
      title: "Last Redirected at",
      dataIndex: "last_redirected_at",
      key: "last_redirected_at",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (obj) => {
        return (
          <button
            onClick={() => {
              setCustomShortlinkObjToUpdate(obj);
              setViewUpdateModal(true);
            }}
            className="px-3 py-1 rounded-md text-white font-medium bg-green-400 hover:bg-green-500"
          >
            Update
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Custom Short Links
      </h1>

      <div className="mt-8 border border-gray-100 shadow-md rounded-md p-2 max-w-fit space-y-4">
        <h1 className="text-lg font-medium text-gray-900">Create</h1>

        {createShortLinkLoading && (
          <RefreshIcon className="text-green-400 animate-spin h-6 w-6" />
        )}

        <input
          value={shortRouteName}
          onChange={(e) => setShortRouteName(e.target.value)}
          maxLength={50}
          placeholder="Short Route Name"
          type="text"
          className="px-2 py-1 rounded-md border-gray-400 border w-full text-gray-800"
        />

        <input
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          maxLength={255}
          placeholder="URL"
          type="text"
          className="px-2 py-1 rounded-md border-gray-400 border w-full text-gray-800"
        />

        <button
          disabled={createShortLinkLoading}
          onClick={createNewShortLink}
          className="px-3 py-1.5 max-w-fit rounded-md bg-green-300 hover:bg-green-600 font-medium text-green-600 hover:text-white"
        >
          Create Short Route
        </button>
      </div>

      <Table dataLoading={loading} columns={columns} dataSource={shortLinks} />

      <UpdateCustomShortlinkModal
        viewModal={viewUpdateModal}
        setViewModal={setViewUpdateModal}
        customFetch={customFetch}
        customShortlinkToUpdate={customShortlinkObjToUpdate}
        refetchData={getAllCustomShortlinks}
      />
    </div>
  );
};

CustomShortlinks.getLayout = LayoutSidebar;

export default CustomShortlinks;
