import React from "react";
import styles from "./index.module.css";
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <img
        src="logo.png"
        alt=""
        draggable="false"
        loading="eager"
      />
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </nav>
  );
};

export default Navbar;
