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
          <p>
            {lastMessage.text.body.length > 20
              ? lastMessage.text.body.substring(0, 20) + "..."
              : lastMessage.text.body.substring(0, 20)}
          </p>
        );
      } else {
        return (
          <p>
            <FaImage size={14} class={styles.lastMessageImageIcon} />
            {lastMessage.type}
          </p>
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
        // onContextMenu={(e) => {
        //   console.log(e.target)
        //   e.preventDefault()
        //   setEditPopupOpen(true);
        // }}
        onClick={(e) => {
          setSelectedUser(userDetails);
          // setEditPopupOpen(true);
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
            <h1>{name}</h1>
            <p>{getTime()}</p>
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
        {userDetails.area && (
          <p
            style={{
              padding: "0 .1rem",
            }}
            className={styles.floatingLoabel}>
            {userDetails.area.length > 4
              ? `${userDetails.area?.substring(0, 4)}...`
              : userDetails.area}
          </p>
        )}
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
