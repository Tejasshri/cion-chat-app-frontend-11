import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import ReactContext from "../../context/ReactContext";
import { apiStatusConstants, webUrl } from "../../Common";
import { FaRegUser } from "react-icons/fa";


import UserMessagesSection from "../UserMessagesSection";

import { useMemo } from "react";
import MessageInputForm from "../MessageInputForm";

const ChatSection = () => {
  const [messageApiStatus, setMessageApiStatus] = useState(
    apiStatusConstants.initial
  );
  const { selectedUser } = useContext(ReactContext);
  const { name } = selectedUser || "";

  return (
    <div className={styles.chatSection}>
      {selectedUser !== undefined && (
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
      )}
    </div>
  );
};

export default ChatSection;
