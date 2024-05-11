import React, { useContext, useState, useEffect, useRef } from "react";

import { webUrl } from "../../Common";

import styles from "./index.module.css";
import ReactContext from "../../context/ReactContext";
import { TailSpin } from "react-loader-spinner";

function LoadMoreButton({ handleScroll }) {
  const { selectedUser, setUserMessages } = useContext(ReactContext);

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const messageLimit = useRef(0);

  const addNewMessages = async () => {
    try {
      setErr("");
      setIsLoading(true);
      let lastMessageApi = `${webUrl}/messageData`;
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: selectedUser.patient_phone_number,
          messageLimit: messageLimit.current,
        }),
      };
      let response = await fetch(lastMessageApi, options);
      let responseData = await response.json();
      if (response.ok) {
        setUserMessages((data) => [...responseData.data, ...data]);
      } else {
        setErr("Oops");
      }
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickLoadMore = () => {
    messageLimit.current++;
    addNewMessages();
  };

 

  return (
    <button onClick={onClickLoadMore} className={styles.loadMoreButton}>
      {isLoading ? (
        <TailSpin height={20} width={20} color="red" />
      ) : err === "" ? (
        "Load More"
      ) : (
        "Retry"
      )}
    </button>
  );
}

export default LoadMoreButton;
