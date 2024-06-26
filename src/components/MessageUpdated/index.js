import React, { useContext, useEffect, useState } from "react";

import { FaRegPlayCircle, FaMapMarkerAlt, FaImage } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";

import { MdDownloadForOffline, MdError } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { AiFillAudio } from "react-icons/ai";
import { RiDownloadLine } from "react-icons/ri";

import { Discuss, TailSpin } from "react-loader-spinner";

import {
  checkSingleEmoji,
  apiStatusConstants,
  timestampToDateTime,
  webUrl,
} from "../../Common";

import styles from "./index.module.css";
import ReactContext from "../../context/ReactContext";

const MessageUpdated = (props) => {
  const [docApiStatus, setDocApiStatus] = useState(apiStatusConstants.initial);
  const [showReactions, setShowReactions] = useState(false);
  const { messageData } = props;
  const { userMessages, setUserMessages, selectedUser, getOptions } =
    useContext(ReactContext);

  if (!messageData) return "something unexpected";
  const { type, message_type, timestamp, media_data, reactions } = messageData;

  const updateDocData = async () => {
    try {
      setDocApiStatus(apiStatusConstants.in_progress);
      let lastMessageApi = `${webUrl}/messageData`;
      let options = getOptions("POST", {
        message_id: messageData.id,
        is_last: false,
      });
      let response = await fetch(lastMessageApi, options);
      let responseData = await response.json();

      if (response.ok) {
        setUserMessages((n) =>
          n.map((each) => {
            return each.id === messageData.id ? responseData.data : each;
          })
        );
        setDocApiStatus(apiStatusConstants.success);
      } else {
        setDocApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setDocApiStatus(apiStatusConstants.failure);
    }
  };

  const getDownloadButton = () => {
    try {
      let { mime_type, filename } = messageData[`${type}`];
      // console.log(mime_type);
      if (!mime_type) return <p>error</p>;
      let [dataName, dataExtension] = mime_type?.split("/") || [];
      if (mime_type.startsWith("application") || mime_type === "text/plain") {
        dataName = type;
      }
      return (
        <a
          className={styles.downloadBtn}
          href={`data:${messageData[`${type}`]?.mime_type};base64,${media_data[
            `${dataName}`
          ].toString("base64")}`}
          download={filename || `${filename}.${dataExtension}`}>
          <MdDownloadForOffline />
        </a>
      );
    } catch (error) {
      console.log(error.message);
      return (
        <p className={styles.error}>
          <MdError color="red" />
          error
        </p>
      );
    }
  };

  const textMessage = (body) => (
    <>
      {checkSingleEmoji(body) ? (
        <p className={styles.singleEmoji}>{body}</p>
      ) : (
        <p>{body}</p>
      )}
      <span className={styles.time}>{timestampToDateTime(timestamp)}</span>
    </>
  );

  const loader = () => (
    <div className={styles.imageLoader}>
      <TailSpin
        style={{ margin: "auto" }}
        visible={true}
        height="30"
        width="30"
        ariaLabel="discuss-loading"
        wrapperStyle={{}}
        wrapperClass="discuss-wrapper"
        color="violet"
        backgroundColor="white"
      />
    </div>
  );

  const imageSuccessView = () => {
    if (!media_data && docApiStatus !== apiStatusConstants.initial)
      return setDocApiStatus(apiStatusConstants.initial);
    let { image: docData } = messageData;
    let { image: dataBuffer } = media_data;
    return (
      <>
        {getDownloadButton()}
        <img
          style={{
            height: "100%",
          }}
          src={`data:${docData.mime_type};base64,${dataBuffer.toString(
            "base64"
          )}`}
          alt="image"
        />
      </>
    );
  };
  const videoSuccessView = () => {
    if (!media_data) return "opps";
    let { video: docData } = messageData;
    let { video: dataBuffer } = media_data;
    return (
      <>
        {getDownloadButton()}
        <video controls className="videoclass">
          <source
            src={`data:${docData.mime_type};base64,${dataBuffer.toString(
              "base64"
            )}`}
            type="video/mp4"
          />
        </video>
      </>
    );
  };
  const audioSuccessView = () => {
    let { audio: docData } = messageData;
    if (!docData) return "error";
    let { audio: dataBuffer } = media_data;
    let { mime_type } = docData;
    return (
      <>
        {getDownloadButton()}
        <audio controls>
          <source
            src={`data:${mime_type};base64,${dataBuffer.toString("base64")}`}
            type={mime_type}
          />
        </audio>
      </>
    );
  };
  const documentSuccessView = () => {
    if (!media_data) return <p style={{ marginLeft: ".6rem" }}>Not Found</p>;
    let { document: docData } = messageData;
    let { audio: dataBuffer } = media_data;
    return getDownloadButton();
  };

  const getSuccessView = () => {
    if (type === "image") return imageSuccessView();
    if (type === "video") return videoSuccessView();
    if (type === "audio") return audioSuccessView();
    if (type === "document") return documentSuccessView();
  };

  const skeltonImage = () => {
    // console.log(
    //   type,
    //   messageData?.compressedImage,
    //   messageData?.image?.mime_type
    // );
    if (type === "video")
      return (
        <FaRegPlayCircle
          size={30}
          onClick={() => updateDocData()}
          className={styles.docImage}
        />
      );
    else if (type === "location") {
      return (
        <FaMapMarkerAlt
          size={30}
          onClick={() => updateDocData()}
          className={styles.docImage}
        />
      );
    } else if (type === "audio")
      return (
        <AiFillAudio
          size={30}
          onClick={() => updateDocData()}
          className={styles.audioIcon}
        />
      );
    else if (type === "document") return "";
    else if (type === "image" && messageData.compressedImage) {
      return (
        <div className={styles.compressedImageDiv}>
          <img
            style={{
              height: "100%",
            }}
            src={`data:${
              messageData.image.mime_type
            };base64,${messageData.compressedImage.toString("base64")}`}
            alt="image"
          />
          <button className={styles.docImage} onClick={() => updateDocData()}>
            <RiDownloadLine color="white" />
          </button>
        </div>
      );
    } else if (type === "image" && messageData.offlinePreview) {
      return (
        <img
          onClick={() => updateDocData()}
          style={{
            height: "100%",
          }}
          src={messageData.offlinePreview}
          alt="image"
        />
      );
    }
    return (
      <FaImage
        size={80}
        onClick={() => updateDocData()}
        className={styles.docImage}
      />
    );
  };

  const getDocView = () => {
    switch (docApiStatus) {
      case apiStatusConstants.in_progress:
        return loader();
      case apiStatusConstants.failure:
        return <MdError className={styles.docImage} color="red" size={30} />;
      case apiStatusConstants.success:
        return getSuccessView();
      default:
        return skeltonImage();
    }
  };

  const getMessageTime = () => (
    <span className={styles.time}>{timestampToDateTime(timestamp)}</span>
  );

  const getLocationView = () => (
    <div className={styles.locationDiv}>
      <iframe
        width="100%"
        height="100%"
        src={`https://maps.google.com/maps?q=${
          messageData?.[`${type}`].latitude
        },${messageData?.[`${type}`].longitude}&z=${12}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="google map"></iframe>
      {messageData.location?.name && (
        <p className={styles.captionAddress}>{messageData.location?.name}</p>
      )}
    </div>
  );

  const getCreatedMessage = () => {
    switch (type) {
      case "text":
        let { body } = messageData["text"];
        return textMessage(body);
      case "image":
        return (
          <div className={styles.imageDiv}>
            {getDocView()}
            {getMessageTime()}
          </div>
        );
      case "video":
        return (
          <div className={styles.videoDiv}>
            {getDocView()}
            {getMessageTime()}
            {messageData.video?.caption &&
              textMessage(messageData.video.caption)}
          </div>
        );
      case "location":
        return getLocationView();
      case "audio":
        return (
          <>
            {getDocView()}
            {getMessageTime()}
          </>
        );
      case "document":
        const { document } = messageData;
        return (
          <div className={styles.documentDiv}>
            <IoDocument
              onClick={() => updateDocData()}
              color="gray"
              size={30}
            />
            <div>
              <p>{document?.filename || "Document"}</p>
            </div>
            {getDocView()}
            {getMessageTime()}
          </div>
        );
    }
  };

  const addReaction = () => {
    return (
      <>
        <div
          className={styles.reactionDiv}
          onClick={() => {
            setShowReactions(!showReactions);
            setTimeout(() => setShowReactions(false), 3000);
          }}>
          {reactions.map((each) => (
            <p>{each.emoji}</p>
          ))}
        </div>

        {showReactions && (
          <div className={styles.reactionUser}>
            {reactions.map((each) => (
              <p>
                {each.user === messageData.from && selectedUser.name}{" "}
                {each.user}
              </p>
            ))}
          </div>
        )}
      </>
    );
  };

  const createIncomingMessage = () => {
    return (
      <div className={styles.message}>
        {getCreatedMessage()}
        {addReaction()}
      </div>
    );
  };

  const createOutgoingMessage = () => {
    return (
      <div className={`${styles.outgoingMessage} ${styles.message}`}>
        {getCreatedMessage()}
        {addReaction()}
      </div>
    );
  };

  switch (message_type) {
    case "Incoming":
      return createIncomingMessage();
    case "Outgoing":
      return createOutgoingMessage();
    default:
      return <p>Work In Progress</p>;
  }
};

export default MessageUpdated;
