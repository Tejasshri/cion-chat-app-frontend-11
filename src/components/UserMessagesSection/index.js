import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";

import { TailSpin } from "react-loader-spinner";

import { apiStatusConstants, webUrl } from "../../Common";

import MessageUpdated from "../MessageUpdated";

import { FaImage } from "react-icons/fa6";
import { IoReloadCircleOutline } from "react-icons/io5";

import styles from "./index.module.css";
import animation from "../../animation.module.css";
import ReactContext from "../../context/ReactContext";
import LoadMoreButton from "../LoadMoreButton";

const SkeltonMessage = () => {
  return (
    <>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink} ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink} ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.photoSkelton} `}>
        <FaImage size={30} color="black" />
      </div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage3}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage4}`}></div>
      {/* <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage3}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div> */}
      {/* <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage2}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage3}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage2}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage2}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.leftSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div>
      <div
        className={`${styles.rightSkeltonMessage} ${animation.blink}  ${styles.widthMessage1}`}></div> */}
    </>
  );
};

const FailureView = ({ refresh }) => {
  return (
    <div className={styles.failureView}>
      <img
        src="https://cdn.dribbble.com/users/5360303/screenshots/19132462/media/88f1307d1a6b8fd41580f7f49d68ccea.jpg"
        alt=""
      />
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
};

const UserMessagesSection = () => {
  const { selectedUser, setUserMessages, userMessages, scroll, getOptions } =
    useContext(ReactContext);
  const [messageApiStatus, setMessageApiStatus] = useState(
    apiStatusConstants.initial
  );
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const limit = useRef(0);

  useEffect(() => {
    autoScroll();
  }, [messageApiStatus, scroll]);

  const autoScroll = () => {
    let section = document.getElementById("userMessageSection");
    let sectionHeight = section.scrollHeight;
    section.scrollTop = sectionHeight;
    section.style.scrollBehavior = "smooth";
  };

  const getMessages = async () => {
    try {
      setMessageApiStatus(apiStatusConstants.in_progress);
      let lastMessageApi = `${webUrl}/messageData`;
      let options = getOptions("POST", {
        user_id: selectedUser.patient_phone_number,
        messageLimit: 0,
      });
      let response = await fetch(lastMessageApi, options);
      let responseData = await response.json();
      if (response.ok) {
        console.log("Okay", responseData.data);
        setUserMessages(responseData.data);
        setMessageApiStatus(apiStatusConstants.success);
      } else {
        console.log("Otherwise");
        setMessageApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setMessageApiStatus(apiStatusConstants.failure);
    }
  };

  const addNewMessages = async () => {
    try {
      setErr("");
      setIsLoading(true);
      let lastMessageApi = `${webUrl}/messageData`;
      let options = getOptions("POST", {
        user_id: selectedUser.patient_phone_number,
        messageLimit: limit.current,
      });
      let response = await fetch(lastMessageApi, options);
      let responseData = await response.json();
      if (response.ok) {
        let i = 0;
        let timer = setInterval(() => {
          if (i === responseData.data.length) {
            clearInterval(timer);
          } else {
            setUserMessages((r) => [responseData.data.at(-i), ...r]);
          }
          i++;
        }, 50);
      } else {
        setErr("Something went wrong");
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserMessage = useCallback(async () => {
    getMessages();
  }, [selectedUser]);

  useEffect(() => {
    console.log(userMessages);
  }, [userMessages]);

  useEffect(() => {
    limit.current = 0;
    getUserMessage();
  }, [selectedUser]);

  const getSuccessView = () => {
    return (
      <>
        {userMessages?.map((each) => (
          <MessageUpdated messageData={each} />
        ))}
      </>
    );
  };

  const getChatView = () => {
    switch (messageApiStatus) {
      case apiStatusConstants.in_progress:
        return <SkeltonMessage />;
      case apiStatusConstants.failure:
        return <FailureView refresh={getMessages} />;
      case apiStatusConstants.success:
        return getSuccessView();
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop === 0 && messageApiStatus === apiStatusConstants.success) {
      limit.current++;
      addNewMessages();
    }
  };

  return (
    <div
      id="userMessageSection"
      className={styles.userMessagesSection}
      onScroll={handleScroll}>
      <button className={styles.loadMoreButton} onClick={addNewMessages}>
        {isLoading && <TailSpin height={20} width={20} color="violet" />}
        {err && <IoReloadCircleOutline size={20} color="red" />}
      </button>
      {getChatView()}
    </div>
  );
};

export default UserMessagesSection;
