import React, { useEffect, useState, Fragment } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { MembersApis } from "../../constants/apis";
import { Select } from "react-select";
import Image from "next/image";

const ChangeMemberChannel = (props) => {
  console.log("Change Member Channel Props", props);

  const [apiLoading, setApiLoading] = useState(false);
  const [channel, setChannel] = useState({});

  useEffect(() => {
    if (props.calledFrom !== "groupActions") {
      setChannel(props.memberForAction.channel);
    }
  }, [props.memberForAction]);

  const updateChannel = (channelToUpdate, member, calledFrom) => {
    setApiLoading(true);

    let memberForAction;

    if (member?.id) {
      memberForAction = member;
    } else {
      memberForAction = props.memberForAction;
    }

    if (channelToUpdate === channel) {
      setApiLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      channel: channelToUpdate,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(MembersApis.UPDATE_CHANNEL(memberForAction.id), requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApiLoading(false);
        if (!result.ok) {
          toast.error(JSON.stringify(result.error));
        } else {
          toast.success("Member Updated Successfully.");
        }
        if (props.calledFrom !== "groupActions") {
          props.getPaginatedLeads(props.currentPagePagination);
          props.setModalOpen(false);
        }
        // console.log(result);
      })
      .catch((error) => {
        setApiLoading(false);
        // toast.error(error);
        // console.log("error", error);
      });
  };

  const triggerGroupAction = (channelToUpdate) => {
    for (let i = 0; i < props.selectedMembers.length; i++) {
      updateChannel(channelToUpdate, props.selectedMembers[i], "groupActions");
    }

    props.setModalOpen(false);
  };

  return (
    <Modal
      apiLoading={apiLoading}
      modalOpen={props.modalOpen || false}
      setModalOpen={props.setModalOpen}
      actionText="Update Channel"
      hideActionButtons
    >
      <div className="space-y-4">
        <div className="flex flex-row">
          <h2 className="text-xl text-gray-700 mr-2">Update Channel for - </h2>
          <h1 className="font-bold text-xl text-gray-800">
            {props?.memberForAction?.name}
          </h1>
        </div>
        {props.calledFrom !== "groupActions" && (
          <div className="flex flex-row">
            <h2 className="text-xl text-gray-700 mr-2">Current Channel - </h2>
            <h1 className="font-bold text-xl text-gray-800">{channel}</h1>
          </div>
        )}
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div
            title="Change channel to ZOOM."
            onClick={() =>
              props.calledFrom == "groupActions"
                ? triggerGroupAction("ZOOM")
                : updateChannel("ZOOM")
            }
            className={`${
              props.calledFrom !== "groupActions"
                ? channel === "ZOOM"
                  ? "opacity-100"
                  : "opacity-40"
                : "opacity-40"
            } grid place-content-center transition duration-300 p-2 border border-gray-100 hover:opacity-100 hover:cursor-pointer hover:shadow-md rounded-md shadow-sm`}
          >
            <Image
              layout="fixed"
              width={150}
              height={60}
              src="/assets/zoom_logo.png"
            />
          </div>

          <div
            title="Change channel to YOUTUBE."
            onClick={() =>
              props.calledFrom == "groupActions"
                ? triggerGroupAction("YOUTUBE")
                : updateChannel("YOUTUBE")
            }
            className={`${
              props.calledFrom !== "groupActions"
                ? channel === "YOUTUBE"
                  ? "opacity-100"
                  : "opacity-40"
                : "opacity-40"
            } grid place-content-center transition duration-300 p-2 border border-gray-100 hover:opacity-100 hover:cursor-pointer hover:shadow-md rounded-md shadow-sm`}
          >
            <Image
              className="hover:cursor-pointer hover:shadow-md shadow-sm"
              layout="fixed"
              width={150}
              height={38}
              src="/assets/youtube_logo.jpg"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeMemberChannel;
