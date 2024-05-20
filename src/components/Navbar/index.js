import React, { useContext, useEffect, useRef, useState } from "react";

import { FaAngleDown } from "react-icons/fa6";

import Cookies from "js-cookie";

import { webUrl } from "../../Common";

import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import ReactContext from "../../context/ReactContext";

import { ToastContainer, toast } from "react-toastify";
const Navbar = ({ isPageLogin, isPageRegister }) => {
  const navigate = useNavigate();
  const { isAuthenticated, getOptions } = useContext(ReactContext);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
            setCoach(responseData?.data?.coachName?.toUpperCase());
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
              <li className={styles.coachContainer}>
                <button onClick={onLogout} className={styles.logInNavBtn}>
                  <div className={styles.coachImage}></div>
                  <div className={styles.coachDetails}>
                    <h1>{coach} Ji</h1>
                    <p>Cancer Coach</p>
                  </div>
                  <FaAngleDown size={14} />
                </button>
              </li>
            )}
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
