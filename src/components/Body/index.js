import { useContext, useEffect } from "react";

import styles from "./index.module.css";

import Sidebar from "../Sidebar";
import ChatSection from "../ChatSection";
import ReactContext from "../../context/ReactContext";
import { webUrl } from "../../Common";
import socket from "../../Socket";

export default function Body() {
  const {
    setUsers,
    users,
    selectedUser,
    userMessages,
    setUserMessages,
    setScroll,
  } = useContext(ReactContext);
  console.log(selectedUser);

  const fetchMessage = async (data) => {
    try {
      // if (selectedUser.patient_phone_number !== data.userNumber) return;
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
        if (responseData.data.type === "reaction") return;
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
        if (selectedUser?.patient_phone_number === data.userNumber) {
          setUserMessages((prevState) => [...prevState, responseData.data]);
          setScroll((n) => !n);
        }

        let updatedUsers = users.map((each) => {
          if (each.patient_phone_number === responseData.data.from) {
            return {
              ...each,
              message_ids: [...each.message_ids, responseData.data.id],
              lastMessage: responseData.data,
            };
          }
          return each;
        });
        updatedUsers = updatedUsers.sort((user1, user2) => {
          return user2.lastMessage.timestamp - user1.lastMessage.timestamp;
        });
        setUsers(updatedUsers);
      } else {
        console.log(responseData, "error");
        alert("Please Refresh the page" + responseData);
      }
    } catch (error) {
      console.log(error);
      alert("Please Refresh the page " + error.message);
    }
  };

  const fetchPatient = async (userNumber) => {
    try {
      const response = await fetch(`${webUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_number: userNumber,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setUsers((users) => [...users, responseData.data]);
      } else {
        alert("Please Refresh");
      }
    } catch (error) {
      alert("Please Refresh");
      console.log(error);
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
      console.log("Update Patient", data.userNumber);
      fetchPatient(data.userNumber);
    });
    return () => {
      socket.disconnect();
      socket.off("update user message");
      socket.off("update patient");
    };
  }, [selectedUser, userMessages, users]);

  return (
    <div className={styles.body}>
      <Sidebar />
      <ChatSection />
    </div>
  );
}
