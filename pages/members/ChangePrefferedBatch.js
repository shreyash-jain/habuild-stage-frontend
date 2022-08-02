import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { MembersApis } from "../../constants/apis";
import Select from "react-select";
import Image from "next/image";

const ChangePrefferedBatch = (props) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState({});
  const [currentPrefferedBatch, setCurrentPrefferedBatch] = useState({});
  const [batchSelectOptions, setBatchSelectOptions] = useState([]);

  useEffect(() => {
    const prefferedBatch = batchSelectOptions.find(
      (item) => item.value === props.memberForAction.preffered_batch_id
    );

    setCurrentPrefferedBatch(prefferedBatch);
  }, [props.memberForAction, props.memberProgramsWithBatches]);

  useEffect(() => {
    computeSelectOptions();
  }, [props.memberProgramsWithBatches]);

  const computeSelectOptions = () => {
    const overallArr = [];

    for (let i = 0; i < props.memberProgramsWithBatches.length; i++) {
      if (
        props.memberProgramsWithBatches[i].batches.some(
          (item) => item.id === props.memberForAction.preffered_batch_id
        )
      ) {
        props.memberProgramsWithBatches[i].batches.map((item1) => {
          const obj = {
            label:
              props.memberProgramsWithBatches[i].title + " - " + item1.name,
            value: item1.id,
          };
          overallArr.push(obj);
        });
      }
    }

    setBatchSelectOptions(overallArr);
  };

  const updatePrefferedBatch = (member, calledFrom) => {
    setApiLoading(true);

    let memberForAction;

    if (member?.id) {
      memberForAction = member;
    } else {
      memberForAction = props.memberForAction;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      member_id: memberForAction.id,
      batch_id: selectedBatchId,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(MembersApis.UPDATE_PREFFERED_BATCH(), requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (result.status == 500) {
          toast.error(JSON.stringify(result.message));
        } else {
          toast.success("Member Updated Successfully.");
        }
        // props.getPaginatedLeads(props.currentPagePagination);
        // props.setModalOpen(false);
        console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        // console.log("error", error);
      });
  };

  const triggerGroupAction = () => {
    for (let i = 0; i < props.selectedMembers.length; i++) {
      updatePrefferedBatch(props.selectedMembers[i], "groupActions");
    }

    props.setModalOpen(false);
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      actionText="Update Preffered Batch"
      onActionButtonClick={
        props.calledFrom == "groupActions"
          ? triggerGroupAction
          : updatePrefferedBatch
      }
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">
            Update Preffered Batch for -{" "}
          </h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">
            Current Preffered Batch -{" "}
          </h2>
          <h1 className="font-bold text-xl text-gray-800">
            {currentPrefferedBatch?.label}
          </h1>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Select new preffered batch{" "}
            </label>
            <Select
              className="w-full"
              onChange={(option) => {
                setSelectedBatchId(option.value);
              }}
              options={batchSelectOptions}
              placeholder="Select Batch"
            ></Select>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePrefferedBatch;
