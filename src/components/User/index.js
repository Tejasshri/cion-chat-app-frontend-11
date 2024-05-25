import React, { useContext, useEffect, useState, memo } from "react";
import { v4 } from "uuid";
import styles from "./index.module.css";
import { webUrl, timestampToDateTime, apiStatusConstants } from "../../Common";
import { FaImage } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactContext from "../../context/ReactContext";

import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";
import PatientEditForm from "../PatientEditForm";

const overlayStyle = { background: "black" };

function isEscapeCharacter(char) {
  return char.charCodeAt(0) === 8206;
}

const User = (props) => {
  const { userDetails, isSelected } = props;
  const { imageUrl, name, lastMessage } = userDetails;
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const { setSelectedUser } = useContext(ReactContext);

  const getLastMessage = () => {
    if (lastMessage) {
      if (lastMessage.type === "text") {
        return (
          <div className={styles.lastMessageInnerDiv2}>
            <p className={styles.lastMessageText}>
              {lastMessage.text.body.length > 20
                ? lastMessage.text.body.substring(0, 20) + "..."
                : lastMessage.text.body.substring(0, 20)}
            </p>
            <p className={styles.time}>{getTime()}</p>
          </div>
        );
      } else {
        return (
          <div className={styles.lastMessageInnerDiv2}>
            <p className={styles.lastMessageText}>
              <FaImage size={14} class={styles.lastMessageImageIcon} />
              {lastMessage.type}
            </p>
            <p className={styles.time}>{getTime()}</p>
          </div>
        );
      }
    }
  };

  const getTime = () => {
    if (lastMessage?.timestamp) {
      return timestampToDateTime(lastMessage.timestamp);
    }
  };

  const getNameFirstLetter = (name) => {
    if (!isEscapeCharacter(name[0])) {
      return name[0];
    }
    return getNameFirstLetter(name.substring(1));
  };

  return (
    <>
      <li
        key={v4()}
        className={
          isSelected ? `${styles.selectedUser} ${styles.user}` : styles.user
        }
        onClick={(e) => {
          setSelectedUser(userDetails);
        }}>
        {!imageUrl ? (
          <div className={styles.imageDiv}>
            {getNameFirstLetter(name) || ""}
          </div>
        ) : (
          <img src={imageUrl} alt="" />
        )}
        <div className={styles.messageDetailsContainer}>
          <div className={styles.messageDetailsHeader}>
            <h1>{name.length > 10 ? name.substring(0, 10) + "..." : name}</h1>
            {userDetails.area && (
              <p
                style={{
                  padding: "0 .1rem",
                }}
                className={styles.floatingLoabel}>
                {userDetails?.area && userDetails.area}
              </p>
            )}
            {userDetails.stage && (
              <p
                style={{
                  padding: "0 .1rem",
                }}
                className={styles.floatingLoabel}>
                {userDetails?.stage && userDetails.stage}
              </p>
            )}
            {userDetails.coach && (
              <p
                style={{
                  padding: "0 .1rem",
                }}
                className={styles.floatingLoabel}>
                {userDetails?.coach && userDetails.coach}
              </p>
            )}
          </div>
          {getLastMessage()}
        </div>
        <button
          className={styles.editUserBtn}
          onClick={(e) => {
            e.stopPropagation();
            setEditPopupOpen(!editPopupOpen);
          }}>
          <BsThreeDotsVertical color="black" />
        </button>
      </li>
      {editPopupOpen && (
        <PatientEditForm
          editPopupOpen={editPopupOpen}
          setEditPopupOpen={setEditPopupOpen}
          userDetails={userDetails}
        />
      )}
    </>
  );
};

export default memo(User);
