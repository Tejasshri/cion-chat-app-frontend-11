import React, { useContext, useState } from "react";

import { FaRegPlayCircle, FaMapMarkerAlt, FaImage } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import { MdDownloadForOffline } from "react-icons/md";
import { AiFillAudio } from "react-icons/ai";

import { Discuss } from "react-loader-spinner";

import { apiStatusConstants, timestampToDateTime, webUrl } from "../../Common";

import styles from "./index.module.css";
import ReactContext from "../../context/ReactContext";

const Message = (props) => {
  const { messageData } = props;
  const { type, message_type, timestamp, media_data, reaction } = messageData;
  const [docApiStatus, setDocApiStatus] = useState(apiStatusConstants.initial);
  const { setUserMessages } = useContext(ReactContext);

  const updateDocData = async () => {
    try {
      setDocApiStatus(apiStatusConstants.in_progress);
      let lastMessageApi = `${webUrl}/messageData`;
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_id: messageData.id,
        }),
      };
      let response = await fetch(lastMessageApi, options);
      let responseData = await response.json();
      console.log(responseData.data);
      setUserMessages((n) =>
        n.map((each) => {
          return each.id === messageData.id ? responseData.data : each;
        })
      );
      setDocApiStatus(apiStatusConstants.success);
    } catch (error) {
      setDocApiStatus(apiStatusConstants.failure);
    }
  };

  const [dataName, dataExtension] = messageData[`${type}`]?.mime_type || [];

  const getDownloadButton = () => {
    if (type === "document") {
      let { mime_type } = messageData[`${type}`];
      if (mime_type === "video/mp4") {
        return (
          <a
            className={styles.downloadBtn}
            href={`data:video/mp4;base64,${media_data.video.toString(
              "base64"
            )}`}
            download={`audio.${dataExtension}`}>
            <MdDownloadForOffline />
          </a>
        );
      }
    } else {
      return (
        <a
          className={styles.downloadBtn}
          href={`data:${messageData[`${type}`]?.mime_type};base64,${media_data[
            `${type}`
          ].toString("base64")}`}
          download={`data.${dataExtension}`}>
          <MdDownloadForOffline />
        </a>
      );
    }
  };

  const getDocView = () => {
    switch (docApiStatus) {
      case apiStatusConstants.in_progress:
        return (
          <div className={styles.imageLoader}>
            <Discuss
              style={{ margin: "auto" }}
              visible={true}
              height="60"
              width="60"
              ariaLabel="discuss-loading"
              wrapperStyle={{}}
              wrapperClass="discuss-wrapper"
              color="green"
              backgroundColor="white"
            />
          </div>
        );
      case apiStatusConstants.success:
        if (type === "video")
          return (
            <video controls className="videoclass">
              <source
                src={`data:video/mp4;base64,${media_data.video.toString(
                  "base64"
                )}`}
                type="video/mp4"
              />
            </video>
          );
        else if (type === "location")
          return (
            <iframe
              src={`https://maps.google.com/maps?q=${
                messageData?.[`${type}`].latitude
              },${messageData?.[`${type}`].longitude}&z=${12}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="google map"></iframe>
          );
        else if (type === "audio")
          return (
            <audio controls>
              <source
                src={`data:audio/mpeg;base64,${media_data.audio.toString(
                  "base64"
                )}`}
                type={(() => {
                  let { mime_type } = messageData[`${type}`];
                  return mime_type;
                })()}
              />
            </audio>
          );

        return (
          <img
            style={{
              height: "100%",
            }}
            src={`data:image/jpeg;base64,${messageData?.media_data?.image.toString(
              "base64"
            )}`}
            alt="image"
          />
        );

      default:
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
              className={styles.docImage}
            />
          );
        return (
          <FaImage
            size={30}
            onClick={() => updateDocData()}
            className={styles.docImage}
          />
        );
    }
  };

  const getMessage = () => {
    switch (type) {
      case "text":
        return (
          <>
            <p>{messageData?.text?.body}</p>
            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
          </>
        );
      case "image":
        return (
          <>
            <div className={styles.imageDiv}>
              {getDocView()}
              {media_data !== undefined && getDownloadButton()}
            </div>
            {messageData?.[`${type}`]?.caption && (
              <p className={styles.caption}>
                {messageData?.[`${type}`]?.caption}
              </p>
            )}
            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
          </>
        );
      case "video":
        return (
          <>
            <span
              style={{
                display: "block",
                height: "100px",
              }}
              className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
            <div className={styles.imageVideo}>
              {getDocView()}
              {media_data !== undefined && getDownloadButton()}
            </div>
            {messageData?.[`${type}`]?.caption && (
              <p className={styles.caption}>
                {messageData?.[`${type}`]?.caption}
              </p>
            )}
            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
          </>
        );
      case "location":
        return (
          <>
            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
            <div className={styles.locationDiv}>{getDocView()}</div>
            {messageData?.[`${type}`]?.name && (
              <>
                <p className={styles.caption}>
                  {messageData?.[`${type}`]?.name}
                </p>
              </>
            )}
            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
          </>
        );
      case "audio":
        return (
          <div className={styles.audioDiv}>
            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
            {getDocView()}
            {media_data !== undefined && getDownloadButton()}
          </div>
        );
      case "document":
        return (
          <>
            <div className={styles.documentDiv}>
              <IoDocument
                size={30}
                color="black"
                onClick={() => updateDocData()}
              />
              {messageData?.[`${type}`]?.filename && (
                <>
                  <p className={styles.caption}>
                    {messageData?.[`${type}`]?.filename}
                  </p>
                </>
              )}
              {media_data !== undefined && getDownloadButton()}
            </div>

            <span className={styles.time}>
              {timestampToDateTime(timestamp)}
            </span>
          </>
        );
    }
  };

  switch (message_type) {
    case "Incoming":
      return (
        <div
          className={`${styles.message} ${styles.incomingMessage} ${
            type !== "text" && styles.docs
          }`}>
          {getMessage()}
        </div>
      );
    case "Outgoing":
      return (
        <div className={`${styles.message} ${styles.outgoingMessage}`}>
          {getMessage()}
        </div>
      );
    default:
      return <div className={styles.message}>Informational</div>;
  }
};

export default Message;
