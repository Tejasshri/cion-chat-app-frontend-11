import React, { useContext, useEffect, useState } from "react";

import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
// import { IoSend } from "react-icons/io5";
import { MdScheduleSend } from "react-icons/md";
import { PiNotePencilFill } from "react-icons/pi";
import { MdCancelScheduleSend } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineInsertPhoto } from "react-icons/md";

import styles from "./index.module.css";
import { webUrl } from "../../Common";
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

  useEffect(() => {
    const inputEl = document.getElementById("message-input");
    inputEl.focus();
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
  }, [selectedUser]);

  const updateFile = async () => {
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      formData.append("to", selectedUser.patient_phone_number);
      const response = fetch("http://localhost:3005/recieve-media", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();
      if (responseData.ok) {
      }
    } catch (error) {}
    console.log(file);
  };

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
        socket.emit("update message", offlineMessage);
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

  const onUpdateFile = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setShowDocMenu(false);
    }
  };

  const dataPreview = () => {
    return (
      preview && (
        <div className={styles.previewContainer} id="preview-container">
          <div>
            {preview.startsWith("data:image") && (
              <img
                src={preview}
                alt="Preview"
                height="100%"
                // width="100%"
              />
            )}
            {preview.startsWith("data:video") && (
              <video controls style={{ maxWidth: "100%", maxHeight: "300px" }}>
                <source src={preview} type={preview.type} />
                Your browser does not support the video tag.
              </video>
            )}
            {preview.startsWith("data:application/pdf") && (
              <embed
                src={preview}
                type="application/pdf"
                width="100%"
                height="300px"
              />
            )}
          </div>
          <button
            type="button"
            onClick={updateFile}
            className={styles.sendFileBtn}>
            <IoSend />
          </button>
        </div>
      )
    );
  };

  const getDocMenu = () => {
    return (
      showDocMenu && (
        <div className={styles.addFilesDiv}>
          <div className={styles.fileUploadDiv}>
            <input
              onChange={onUpdateFile}
              type="file"
              id="file"
              accept="image/jpeg, image/png, video/mp4"
            />
            <label htmlFor="file">
              <MdOutlineInsertPhoto />
              Photo & Video
            </label>
          </div>
          <div className={styles.fileUploadDiv}>
            <input
              onChange={(e) => setFolder(e.target)}
              type="file"
              id="documents"
              accept=".pdf,video/*,image/*"
            />
            <label htmlFor="documents">
              <MdOutlineInsertPhoto />
              Document
            </label>
          </div>
        </div>
      )
    );
  };

  return (
    <form className={styles.messageForm} onSubmit={sendMessage}>
      
      <div className={styles.inputDiv}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message-input"
          disabled={loading || file !== null}
        />
        <button type="submit" disabled={loading || file !== null}>
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
