import React from "react";
import { Button } from "primereact/button";

import Cookies from "js-cookie";

import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
const Navbar = ({ isPageLogin, isPageRegister }) => {
  console.log(isPageLogin, isPageRegister);
  const navigate = useNavigate();

  const onLogout = () => {
    Cookies.remove("chat_token");
    navigate("/login", {
      replace: true,
    });
  };

  const getNavLinks = () => {
    switch (true) {
      case isPageRegister:
        return (
          <button
            className={styles.logInNavBtn}
            onClick={() => navigate("/login")}>
            Sign in
          </button>
        );
      case isPageLogin:
        return (
          <button
            className={styles.logInNavBtn}
            onClick={() => navigate("/register")}>
            Sign up
          </button>
        );
      default:
        return (
          <>            
            <li>
              <button onClick={onLogout} className={styles.logInNavBtn}>
                Logout
              </button>
            </li>
          </>
        );
    }
  };

  return (
    <nav className={styles.navbar}>
      <img src="logo.png" alt="" draggable="false" loading="eager" />
      <ul>{getNavLinks()}</ul>
    </nav>
  );
};

export default Navbar;
