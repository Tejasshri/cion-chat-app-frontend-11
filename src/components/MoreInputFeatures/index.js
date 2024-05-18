import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import styles from "./index.module.css";

import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
// import { IoSend } from "react-icons/io5";
import { MdClose, MdScheduleSend } from "react-icons/md";
import { PiNotePencilFill } from "react-icons/pi";
import { MdCancelScheduleSend } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineInsertPhoto } from "react-icons/md";

import { useContext, useState } from "react";
import ReactContext from "../../context/ReactContext";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import { webUrl } from "../../Common";

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
    setMessage,
    setShowEmojiPicker,
    setShowEditor,
  } = props;
  const {
    getOptions,
    selectedUser,
    setUserMessages,
    users,
    setUsers,
    setScroll,
  } = useContext(ReactContext);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const sendData = () => {
    if (file) {
      sendFile();
    } else if (folder) {
      sendFolder();
    }
  };

  const dataPreview = () => {
    return (
      preview && (
        <div className={styles.previewContainer} id="preview-container">
          <button
            className={styles.closeBtn}
            onClick={() => {
              setPreview(null);
              setFile(null);
              setFolder(null);
            }}>
            <MdClose />
          </button>
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
              <>
                <embed
                  src={preview}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                />
              </>
            )}
          </div>
          <button
            type="button"
            onClick={sendData}
            className={styles.sendFileBtn}>
            {loading ? (
              <TailSpin height={20} width={20} color="white" />
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

  const onUpdateFolder = (event) => {
    const folderItem = event.target.files[0];
    console.log(folderItem);
    setFolder(folderItem);
    if (folderItem) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(folderItem);
      setShowDocMenu(false);
    }
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
              onChange={onUpdateFolder}
              type="file"
              id="documents"
              accept="audio/aac, audio/mp4, audio/mpeg, audio/amr, audio/ogg, audio/opus, application/vnd.ms-powerpoint, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, text/plain, application/vnd.ms-excel, image/jpeg, image/png, image/webp, video/mp4, video/3gpp"
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
      console.log(getOptions("POST", formData, true, true));
      const response = await fetch(
        `${webUrl}/recieve-media`,
        getOptions("POST", formData, true, true)
      );

      const responseData = await response.json();
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
          offlinePreview: preview,
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
        setPreview(null);
        focus();
        socket.emit("update message", offlineFileMessage);
      } else {
        console.log(responseData.msg);
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

  const sendFolder = async () => {
    try {
      setLoading(true);
      setErr("");
      if (!folder) return;
      let type = "document";
      const formData = new FormData();
      formData.append("file", folder);
      formData.append("type", "document");
      formData.append("to", selectedUser.patient_phone_number);
      const response = await fetch(
        `${webUrl}/recieve-media`,
        getOptions("POST", formData, true, true)
      );
      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        let offlineFileMessage = {
          _id: responseData.data.id,
          from: selectedUser.patient_phone_number,
          id: responseData.data.whatsappMessageId,
          timestamp: new Date().getTime(),
          type: type,
          [type]: {
            filename: folder.name,
            mime_type: folder.type,
            sha256: "",
            id: "",
          },
          message_type: "Outgoing",
          reactions: [],
          delivery_status: "",
          offlinePreview: preview,
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
        setPreview(null);
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
      <button
        type="button"
        className={styles.featureBtn}
        onClick={() => {
          setShowEditor(false);
          setShowEmojiPicker((n) => !n);
        }}>
        <MdOutlineEmojiEmotions size={20} />
      </button>
      <button
        className={styles.featureBtn}
        type="button"
        onClick={() => setShowDocMenu((n) => !n)}>
        <FaPlus size={20} />
      </button>
      <button
        type="button"
        className={styles.featureBtn}
        onClick={() => {
          setShowEmojiPicker(false);
          setShowEditor((n) => !n);
        }}>
        <PiNotePencilFill size={20} />
      </button>
    </>
  );
};

export default MoreInputFeatures;
