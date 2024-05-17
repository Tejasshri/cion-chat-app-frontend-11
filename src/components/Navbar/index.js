import React from "react";
import { Button } from "primereact/button";

import styles from "./index.module.css";
const Navbar = ({ isPageLogin }) => {
  return (
    <nav className={styles.navbar}>
      <img src="logo.png" alt="" draggable="false" loading="eager" />
      <ul>
        {isPageLogin ? (
          <button className={styles.logInNavBtn}>Login</button>
        ) : (
          <>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
