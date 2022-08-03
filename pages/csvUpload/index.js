import React, { useEffect, useState, Fragment } from "react";
import LayoutSidebar from "../../components/LayoutSidebar";
import Table from "../../components/Table";
import {
  XCircleIcon,
  CheckCircleIcon,
  MenuAlt1Icon,
  ExternalLinkIcon,
  RefreshIcon,
  DownloadIcon,
} from "@heroicons/react/outline";
import toast from "react-hot-toast";
import Image from "next/image";
import { remove_backslash_characters } from "../../utils/stringUtility";
import {
  ProgramsApis,
  BatchesApis,
  PaymentApis,
  MembersApis,
  PlanApis,
} from "../../constants/apis";
import MemberCSVUpload from "../members/MemberCSVUpload";
import useCheckAuth from "../../hooks/useCheckAuth";
import { useFetchWrapper } from "../../utils/apiCall";

const CsvUpload = (props) => {
  const checkAuthLoading = useCheckAuth(false);

  const { customFetch, customFetchFile } = useFetchWrapper();

  const [apiLoading, setApiLoading] = useState();
  const [csvArray, setCsvArray] = useState([]);
  const [includeInactiveMember, setIncludeInactiveMember] = useState(false);
  const [memberDataFile, setMemberDataFile] = useState({});

  const processCSV = (str, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });

    // console.log("New Arrr", newArray);

    setCsvArray(newArray);

    for (let i = 0; i < newArray.length; i++) {
      const dataObj = {
        Amount: newArray[i].Amount?.replace(/\D/g, ""),
        Email: newArray[i].Email,
        ["Mobile Number"]: newArray[i]["Mobile Number"],
        Name: newArray[i].Name,
        selectedBatch: remove_backslash_characters(
          newArray[i]["Selected Batch\r"]
        ),
        ["Payment App "]: "NA",
      };

      if (dataObj.Amount !== undefined) {
        formSubmit({}, true, dataObj);
      }
    }
    props.getAllPaymentsToApprove();
    props.setViewModal(false);
    setApiLoading(false);
  };

  const csvHandler = (file) => {
    setApiLoading(true);
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      // console.log(text);
      processCSV(text);
    };

    reader.readAsText(file);
  };

  const formSubmit = async (e, fromCSV, data) => {
    setApiLoading(true);

    let dataObj = {};

    if (!fromCSV) {
    } else {
      dataObj = data;
    }

    let API = PaymentApis.CREATE_OFFLINE_PAYMENT();
    let method = "POST";

    // console.log(raw);
    // console.log(API);
    // console.log(method);

    // console.log(requestOptions);

    try {
      await customFetch(API, method, dataObj);

      setApiLoading(false);
      toast.success(`Payment Created`);

      // console.log("Api Result", result);
    } catch {
      (error) => {
        // console.log("error", error);
        if (!fromCSV) {
          setApiLoading(false);
          toast.error(`No payment Created`);
        }
      };
    }
  };

  const formSubmitStageTest = (calledFrom) => {
    setApiLoading(true);

    let API = `https://stage.api.habuild.in/api/upload_csv/upload_member?includeInactiveMember=${includeInactiveMember}`;
    let file = memberDataFile;

    // console.log(requestOptions);

    try {
      customFetchFile(API, "POST", file);

      // console.log("Result", result);
      setApiLoading(false);
      if (result.status == 200) {
        toast.success(result.message);
      } else {
        if (result?.message) {
          toast.error(result.message);
        } else {
          toast.error("Error");
        }
      }
      // props.refreshData();
      // props.setModalOpen(false);
    } catch (err) {
      setApiLoading(false);
      toast.error(err);
      // console.log("error", error);
    }
  };

  if (checkAuthLoading) {
    return (
      <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
    );
  }

  if (apiLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-left text-xl font-bold text-gray-900">
          Upload Data from CSV{" "}
        </h1>
        <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-left text-xl font-bold text-gray-900">
        Upload Data from CSV{" "}
      </h1>

      <div className="p-4 rounded-md shadow-sm border border-gray-100 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Payments for Approval
        </label>

        <a
          href="/assets/payments_for_approval_template.csv"
          download={"payments_for_approval_template.csv"}
          className="flex flex-row px-3 py-1 text-sm font-medium rounded-md border border-gray-500 max-w-fit hover:bg-gray-200"
        >
          <DownloadIcon className="w-4 h-4 mr-2" /> Download Template For
          Payment Aprroval
        </a>

        <input
          type="file"
          accept=".csv"
          id="csvFile"
          onChange={(e) => {
            if (e.target.files[0]) {
              setApiLoading(true);
              csvHandler(e.target.files[0]);
            }
          }}
        ></input>

        {csvArray.length > 0 && <p>{csvArray.length} Rows read from CSV.</p>}
      </div>

      <MemberCSVUpload />

      <div className="p-4 rounded-md shadow-sm border border-red-100 space-y-4">
        <h1 className="text-xl font-medium text-gray-800">
          **************FEATURE ON STAGE TESTING - Dont run on
          Production**************
        </h1>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">
            STAGE Update Member Data
          </label>
          <a
            href="/assets/Member_data_template.csv"
            download={"Member_data_template.csv"}
            className="text-gray-600 flex flex-row px-3 py-1 text-sm font-medium rounded-md max-w-fit hover:bg-gray-200"
          >
            <DownloadIcon className="w-4 h-4 mr-2" /> Download Member Data
            Template
          </a>

          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              onChange={(e) => {
                setIncludeInactiveMember(e.target.checked);
              }}
            ></input>
            <label className="block text-sm font-medium text-gray-700">
              Include Inactive Member
            </label>
          </div>

          <input
            onChange={(e) => setMemberDataFile(e.target.files[0])}
            type={"file"}
          />
          <button
            onClick={() => formSubmitStageTest("data")}
            className="max-w-fit px-3 py-2 text-green-700 bg-green-300 hover:text-white hover:bg-green-700 font-medium rounded-md"
          >
            Update Member Data
          </button>
        </div>
      </div>
    </div>
  );
};

CsvUpload.getLayout = LayoutSidebar;

export default CsvUpload;
