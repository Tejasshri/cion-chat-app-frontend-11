import { useContext, useEffect } from "react";

import styles from "./index.module.css";

import Sidebar from "../Sidebar";
import ChatSection from "../ChatSection";
import ReactContext from "../../context/ReactContext";
import { webUrl } from "../../Common";
import socket from "../../Socket";

export default function Body() {
  const { selectedUser, userMessages, setUserMessages, setScroll } =
    useContext(ReactContext);
  const fetchMessage = async (data) => {
    try {
      if (selectedUser.patient_phone_number !== data.userNumber) return;
      await userMessages.forEach((element) => {
        console.log(element, data, "data");
      });

      const response = await fetch(`${webUrl}/messageData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_id: data.whatsappMessageId,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        // let isMessageExists = false;
        // userMessages.forEach((element) => {
        //   console.log(element.id === responseData.data.id);
        // });
        // if (isMessageExists) {
        //   setUserMessages((prevMessages) => {
        //     return prevMessages.map((each) => {
        //       return each.id === responseData?.data?.whatsappMessageId
        //         ? responseData.data
        //         : each;
        //     });
        //   });
        //   return;
        // }
        setUserMessages((prevState) => [...prevState, responseData.data]);
        setScroll((n) => !n);
      } else {
        console.log(responseData, "error");
        alert("Please Refresh the page");
      }
    } catch (error) {
      console.log(error);
      alert("Please Refresh the page");
    }
  };
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("join", "Joined");
    });
    socket.on("update user message", (data) => {
      fetchMessage(data);
    });
    socket.on("update patient", (data) => {
      console.log("Update Patient", data);
    });
    return () => {
      socket.disconnect();
      socket.off("update user message");
      socket.off("update patient");
    };
  }, [selectedUser, userMessages]);
  return (
    <div className={styles.body}>
      <Sidebar />
      <ChatSection />
    </div>
  );
}
