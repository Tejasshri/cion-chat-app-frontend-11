import React, { useContext, useEffect, useState } from "react";

import { IoSend } from "react-icons/io5";
import { MdScheduleSend } from "react-icons/md";
import { MdCancelScheduleSend } from "react-icons/md";

import styles from "./index.module.css";
import { webUrl } from "../../Common";
import ReactContext from "../../context/ReactContext";
import { TailSpin } from "react-loader-spinner";

import socket from "../../Socket.js";

function MessageInputForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { selectedUser, setUserMessages, setScroll } = useContext(ReactContext);

  useEffect(() => {
    socket.on("connect", async () => {
      socket.emit("join", "Joined");
      socket.emit("join room", "appu", selectedUser.from);
    });
    socket.connect();
    socket.on("update message", (messageId) => {
      console.log(messageId);
      setUserMessages((n) => [...n, messageId]);
      setScroll((n) => !n);
    });
    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("update message");
    };
  }, []);

  function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000); // Divide by 1000 to convert milliseconds to seconds
  }

  const sendMessage = async (event) => {
    event.preventDefault();
    const api = webUrl + "/message";
    let preparedMsg = {
      messaging_product: "whatsapp",
      to: selectedUser.patient_phone_number,
      type: "text",
      data: {
        text: message,
      },
    };
    try {
      setErr("")
      setLoading(true);
      let response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedMsg),
      });
      let offlineMessage = {
        _id: "",
        coach_phone_number: "+15556105902",
        from: selectedUser.patient_phone_number,
        coach_name: "",
        id: selectedUser.id,
        type: "text",
        text: { body: message },
        reactions: [],
        message_type: "Outgoing",
        delivery_status: "",
        timestamp: getCurrentTimestamp(),
      };
      const responseData = await response.json();
      if (response.ok) {
        offlineMessage._id = responseData.id;
        setUserMessages((n) => [...n, offlineMessage]);
        setMessage("");
        await socket.emit("update message", offlineMessage);
      } else {
        setErr(responseData.msg);
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
      setScroll((n) => !n);
    }
  };

  return (
    <form className={styles.messageForm} onSubmit={sendMessage}>
      <div className={styles.inputDiv}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            // <MdScheduleSend color="yellow" className={styles.sendIcon} />
            <TailSpin
              color="white"
              visible={true}
              height="20"
              width="20"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : err === "" ? (
            <IoSend className={styles.sendIcon} />
          ) : (
            <MdCancelScheduleSend className={styles.sendIcon} />
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageInputForm;
