import styles from "./index.module.css";

import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
// import { IoSend } from "react-icons/io5";
import { MdScheduleSend } from "react-icons/md";
import { PiNotePencilFill } from "react-icons/pi";
import { MdCancelScheduleSend } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { useContext, useState } from "react";
import ReactContext from "../../context/ReactContext";
import { TailSpin } from "react-loader-spinner";

const MoreInputFeatures = (props) => {
  const {
    focus,
    showDocMenu,
    setShowDocMenu,
    preview,
    file,
    setFile,
    folder,
    setFolder,
    setPreview,
    socket,
  } = props;
  const { selectedUser, setUserMessages, users, setUsers, setScroll } =
    useContext(ReactContext);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
                draggable={false}
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
            onClick={sendFile}
            className={styles.sendFileBtn}>
            {loading ? (
              <TailSpin height={30} width={30} color="white" />
            ) : err !== "" ? (
              <MdCancelScheduleSend color="white" />
            ) : (
              <IoSend />
            )}
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
              disabled
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

  const sendFile = async () => {
    try {
      setLoading(true);
      setErr("");
      if (!file) return;
      let type = file.type.split("/")[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      formData.append("to", selectedUser.patient_phone_number);
      const response = await fetch("http://localhost:3005/recieve-media", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const responseData = await response.json();
      console.clear();
      console.log(responseData);
      if (response.ok) {
        let offlineFileMessage = {
          _id: responseData.data.id,
          from: selectedUser.patient_phone_number,
          id: responseData.data.whatsappMessageId,
          timestamp: 1715326688,
          type: type,
          [type]: {
            filename: file.name,
            mime_type: file.type,
            sha256: "",
            id: "",
          },
          message_type: "Outgoing",
          reactions: [],
          delivery_status: "",
        };
        setUserMessages((n) => [...n, offlineFileMessage]);
        setScroll((n) => !n);
        console.log(offlineFileMessage, users);
        let updatedUsers = users.map((each) => {
          if (each.patient_phone_number === offlineFileMessage.from) {
            return {
              ...each,
              lastMessage: offlineFileMessage,
            };
          }
          return each;
        });
        updatedUsers = updatedUsers.sort((user1, user2) => {
          return user2.lastMessage.timestamp - user1.lastMessage.timestamp;
        });
        setUsers(updatedUsers);
        setFile(null);
        setPreview(false);
        focus();
        socket.emit("update message", offlineFileMessage);
      } else {
        setErr(responseData.msg || "Something Unexpected");
      }
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    } finally {
      setLoading(false);
    }
    console.log(file);
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

  return (
    <>
      {getDocMenu()}
      {dataPreview()}
      <button type="button" className={styles.featureBtn}>
        <MdOutlineEmojiEmotions size={20} color="violet" />
      </button>
      <button
        className={styles.featureBtn}
        type="button"
        onClick={() => setShowDocMenu((n) => !n)}>
        <FaPlus size={20} color="violet" />
      </button>
      <button type="button" className={styles.featureBtn}>
        <PiNotePencilFill size={20} color="violet" />
      </button>
    </>
  );
};

export default MoreInputFeatures;
