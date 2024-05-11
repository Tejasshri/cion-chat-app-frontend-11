import React, { useContext, useEffect, useState, memo } from "react";
import { v4 } from "uuid";
import styles from "./index.module.css";
import { webUrl, timestampToDateTime, apiStatusConstants } from "../../Common";
import { FaImage } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import ReactContext from "../../context/ReactContext";

function isEscapeCharacter(char) {
  return char.charCodeAt(0) === 8206;
}

const User = (props) => {
  const { userDetails, isSelected } = props;
  const { imageUrl, name, lastMessage } = userDetails;

  const { setSelectedUser } = useContext(ReactContext);

  const getLastMessage = () => {
    if (lastMessage) {
      if (lastMessage.type === "text") {
        return (
          <p>
            {lastMessage.text.body.length > 30
              ? lastMessage.text.body.substring(0, 30) + "..."
              : lastMessage.text.body.substring(0, 30)}
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
    <li
      key={v4()}
      className={isSelected ? `${styles.selectedUser} ${styles.user}` : styles.user}
      onClick={() => {
        setSelectedUser(userDetails);
      }}>
      {!imageUrl ? (
        <div className={styles.imageDiv}>{getNameFirstLetter(name)}</div>
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
    </li>
  );
};

export default memo(User);
