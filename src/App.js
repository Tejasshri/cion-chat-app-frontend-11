import React, { useEffect, useState } from "react";

// Pages
import ChatApp from "./pages/ChatApp";

// Componnets
import Navbar from "./components/Navbar";
import ContactsList from "./components/ContactsList";
import ChatSection from "./components/ChatSection";

//Context
import ReactContext from "./context/ReactContext";

// Styles in module
import "./App.css";

import socket from "./Socket";

export default function App() {
  const [users, setUsers] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("connected")
      socket.emit("join", "Joined");
    });
    socket.on("update user message", () => {
      console.log("Update message");
    });
    return () => socket.disconnect();
  }, []);

  return (
    <ReactContext.Provider
      value={{
        users,
        setUsers,
        userMessages,
        setUserMessages,
        selectedUser,
        setSelectedUser,
        scroll,
        setScroll,
      }}>
      <ChatApp />
    </ReactContext.Provider>
  );
}
