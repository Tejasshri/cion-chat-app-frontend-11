import React, { useCallback, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cookies from "js-cookie";

// Pages
import ChatApp from "./pages/ChatApp";

// Components

//Context
import ReactContext from "./context/ReactContext";

// Styles in module
import "./App.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [users, setUsers] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [scroll, setScroll] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getOptions = (
    method,
    data = {},
    token_needed = true,
    isFile = false
  ) => {
    let token = Cookies.get("chat_token");
    let obj = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: !isFile ? JSON.stringify(data) : data,
    };
    if (method === "GET") {
      delete obj.body;
    }
    if (token_needed) {
      obj.headers["Authorization"] = `Bearer ${token}`;
    }
    if (isFile) {
      delete obj.headers["Content-Type"];
      obj.headers["Accept"] = "application/json";
    }
    return obj;
  };

  return (
    <ReactContext.Provider
      value={{
        getOptions,
        users,
        setUsers,
        userMessages,
        setUserMessages,
        selectedUser,
        setSelectedUser,
        scroll,
        setScroll,
        isAuthenticated,
        setIsAuthenticated
      }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute component={ChatApp} />} />
        </Routes>
      </BrowserRouter>
    </ReactContext.Provider>
  );
}
