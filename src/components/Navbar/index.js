import React, { useContext, useEffect, useRef, useState } from "react";

import { FaAngleDown } from "react-icons/fa6";

import Cookies from "js-cookie";

import { webUrl } from "../../Common";

import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import ReactContext from "../../context/ReactContext";

import { ToastContainer, toast } from "react-toastify";
import PopupContext from "../../context/PopupContext";
const Navbar = ({ isPageLogin, isPageRegister }) => {
  const navigate = useNavigate();
  const { isAuthenticated, getOptions } = useContext(ReactContext);
  const { hidePopup } = useContext(PopupContext);
  const [showPopup, setShowPopup] = useState(false);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    console.log("hidePopup");
    setShowPopup(false);
  }, [hidePopup]);

  useEffect(() => {
    const token = Cookies.get("chat_token");
    if (token && !coach) {
      (async () => {
        try {
          setLoading(true);
          const options = getOptions("POST");
          const response = await fetch(`${webUrl}/get-coach-details`, options);
          const responseData = await response.json();
          if (response.ok) {
            setCoach(responseData?.data?.coachName);
          } else {
            setErr(responseData.msg || "Some Went Wrong");
            toast.error(responseData.msg || "Some Went Wrong");
          }
        } catch (error) {
          toast.error(error.message || "Some Went Wrong");
          console.log(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isAuthenticated]);

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
            {loading ? (
              <li className={styles.skeltonItem}></li>
            ) : (
              <li
                className={styles.coachContainer}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                <button
                  className={styles.logInNavBtn}
                  onClick={() => setShowPopup((n) => !n)}>
                  <div className={styles.coachImage}>
                    {coach?.substring(0, 1) || ""}
                  </div>
                  <div className={styles.coachDetails}>
                    <h1>{coach}</h1>
                    <p>Cancer Coach</p>
                  </div>
                  <FaAngleDown size={14} />
                  {showPopup && (
                    <div className={styles.logoutPopupDiv}>
                      <button className={styles.popupBtn}>Settings</button>
                      <button className={styles.popupBtn} onClick={onLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </button>
              </li>
            )}
          </>
        );
    }
  };

  return (
    <nav className={styles.navbar}>
      <img src="logo-final.png" alt="Nav" draggable="false" loading="eager" />
      <ul>{getNavLinks()}</ul>
    </nav>
  );
};

export default Navbar;
