import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import ReactContext from "../../context/ReactContext";
import { apiStatusConstants, webUrl } from "../../Common";
import { FaRegUser } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

import UserMessagesSection from "../UserMessagesSection";

import { useMemo } from "react";
import MessageInputForm from "../MessageInputForm";

const ChatSection = () => {
  const [messageApiStatus, setMessageApiStatus] = useState(
    apiStatusConstants.initial
  );
  const { selectedUser } = useContext(ReactContext);
  const { name } = selectedUser || "";

  const getNotSelectedView = () => (
    <div className={styles.notSelectedView}>
      <img draggable={false} src="logo-1-new.png" alt="" />
      <h1>
        <FaWhatsapp /> ChatApp for CION Cancers
      </h1>
      <p>Chats between you and patients are end to end encrypted</p>
    </div>
  );

  return (
    <div className={styles.chatSection}>
      {selectedUser !== undefined ? (
        <>
          <div className={styles.userDetailsHeader}>
            <div className={styles.userImageDiv}>
              <FaRegUser size={24} />
            </div>
            <div className={styles.userPersonalData}>
              <div className={styles.userNameAndOnlineStatus}>
                <h1>{name}</h1>
                <p>
                  <span></span>online
                </p>
              </div>
            </div>
          </div>
          <UserMessagesSection />
          <MessageInputForm />
        </>
      ) : (
        getNotSelectedView()
      )}
    </div>
  );
};

export default ChatSection;
