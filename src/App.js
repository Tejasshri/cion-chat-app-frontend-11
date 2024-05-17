import React, { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import ChatApp from "./pages/ChatApp";

// Components

//Context
import ReactContext from "./context/ReactContext";

// Styles in module
import "./App.css";

import LoginPage from "./pages/LoginPage";

export default function App() {
  const [users, setUsers] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [scroll, setScroll] = useState(false);


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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ChatApp />} />
        </Routes>
      </BrowserRouter>
    </ReactContext.Provider>
  );
}
