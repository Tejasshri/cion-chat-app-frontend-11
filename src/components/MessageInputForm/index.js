import React, { useContext, useEffect, useState, useRef } from "react";

import { Toast } from "primereact/toast";

import { Editor } from "primereact/editor";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
// import { IoSend } from "react-icons/io5";
import { MdError, MdScheduleSend } from "react-icons/md";
import { PiNotePencilFill } from "react-icons/pi";
import { MdCancelScheduleSend } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";

import MoreInputFeatures from "../MoreInputFeatures/index.js";

import styles from "./index.module.css";
import { apiStatusConstants, webUrl } from "../../Common";
import ReactContext from "../../context/ReactContext";
import { TailSpin } from "react-loader-spinner";

import socket from "../../Socket.js";

function MessageInputForm() {
  const [showDocMenu, setShowDocMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { users, setUsers, selectedUser, setUserMessages, setScroll } =
    useContext(ReactContext);
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [text, setText] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const toast = useRef(null);
  const [textApiStatus, setTestApiStatus] = useState(
    apiStatusConstants.initial
  );

  // useEffect(() => {
  //   if (!file) return;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function (event) {
  //       const previewContainer = document.getElementById("preview-container");
  //       previewContainer.innerHTML = ""; // Clear previous preview
  //       if (file.type.startsWith("image")) {
  //         const img = document.createElement("img");
  //         img.src = event.target.result;
  //         img.alt = "Preview";
  //         img.id = "file-preview";
  //         previewContainer.appendChild(img);
  //       } else if (file.type.startsWith("video")) {
  //         const video = document.createElement("video");
  //         video.src = event.target.result;
  //         video.controls = true;
  //         video.id = "file-preview";
  //         previewContainer.appendChild(video);
  //       } else if (file.type === "application/pdf") {
  //         const embed = document.createElement("embed");
  //         embed.src = event.target.result;
  //         embed.type = "application/pdf";
  //         embed.width = "100%";
  //         embed.height = "300px"; // Adjust height as needed
  //         embed.id = "file-preview";
  //         previewContainer.appendChild(embed);
  //       } else {
  //         previewContainer.textContent = "Unsupported file type";
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }, [file]);

  const focus = () => {
    const inputEl = document.getElementById("message-input");
    inputEl.focus();
  };

  useEffect(() => {
    focus();
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
    setShowDocMenu(false);
    setMessage("");
    setErr("");
    setFile(null);
    setFolder(null);
    setPreview(null);
    setShowEditor(true);
    console.clear();
    console.log(selectedUser.note);
    setText(selectedUser.note);
    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("update message");
    };
  }, [selectedUser]);

  useEffect(() => {
    // if (!text) return;
    const noteUpdateCallback = async () => {
      try {
        setTestApiStatus(apiStatusConstants.in_progress);
        const response = await fetch(`${webUrl}/get-user-note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_phone_number: selectedUser.patient_phone_number,
            note: text,
          }),
        });
        const responseData = await response.json();
        if (response.ok) {
          setUsers((prevUser) =>
            prevUser.map((each) => {
              if (
                each.patient_phone_number === selectedUser.patient_phone_number
              ) {
                return {
                  ...each,
                  note: text,
                };
              }
              return each;
            })
          );
          setTestApiStatus(apiStatusConstants.success);
        } else {
          console.log(responseData);
          setTestApiStatus(apiStatusConstants.failure);
          alert("Error");
        }
      } catch (error) {
        alert(error.message);
        console.log(error);
        setTestApiStatus(apiStatusConstants.failure);
      }
    };

    let timer = setTimeout(noteUpdateCallback, 1000);
    return () => clearTimeout(timer);
  }, [text]);

  function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
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
      setErr("");
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
        console.log(offlineMessage, users);
        let updatedUsers = users.map((each) => {
          if (each.patient_phone_number === offlineMessage.from) {
            return {
              ...each,
              lastMessage: offlineMessage,
            };
          }
          return each;
        });
        updatedUsers = updatedUsers.sort((user1, user2) => {
          return user2.lastMessage.timestamp - user1.lastMessage.timestamp;
        });
        setUsers(updatedUsers);
        setMessage("");
        setShowEmojiPicker(false);
        socket.emit("update message", offlineMessage);
      } else {
        setErr(responseData.msg);
      }
    } catch (error) {
      console.log(error);
      setErr(error.message);
    } finally {
      setLoading(false);
      setScroll((n) => !n);
    }
  };

  const getEmojiPicker = () => {
    return (
      <div className={styles.emojiPickerDiv}>
        <Picker
          dynamicWidth={true}
          theme="light"
          data={data}
          onEmojiSelect={(e) => setMessage((prevText) => prevText + e.native)}
        />
      </div>
    );
  };

  const getNoteSavedStatus = () => {
    switch (textApiStatus) {
      case apiStatusConstants.in_progress:
        return <TailSpin height={30} width={30} color="red" />;
      case apiStatusConstants.success:
        return <MdBookmarkAdded color="green" size="30" />;
      case apiStatusConstants.failure:
        return <MdError color="red" size="30" />;
      default:
        break;
    }
  };

  const getEditor = () => {
    return (
      <div className={styles.editorDiv}>
        <div className={styles.editorLoader}>{getNoteSavedStatus()}</div>
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue)}
          style={{ height: "4rem" }}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <form className={styles.messageForm} onSubmit={sendMessage}>
        <MoreInputFeatures
          preview={preview}
          file={file}
          setFile={setFile}
          folder={folder}
          setFolder={setFolder}
          setPreview={setPreview}
          showDocMenu={showDocMenu}
          setShowDocMenu={setShowDocMenu}
          socket={socket}
          focus={focus}
          setMessage={setMessage}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          setShowEditor={setShowEditor}
        />
        <div className={styles.inputDiv}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="message-input"
          />
          <button type="submit" disabled={loading || file !== null}>
            {loading ? (
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
      {showEmojiPicker && !showEditor && getEmojiPicker()}
      {showEditor && getEditor()}
    </>
  );
}

export default MessageInputForm;
