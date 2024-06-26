// From React
import React, { useState } from "react";

// Components
import Navbar from "../../components/Navbar";
import LoginBody from "../../components/LoginBody";

// Styles Module
import styles from "./index.module.css";



function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Navbar isPageLogin={true} />
      <LoginBody />
    </div>
  );
}

export default LoginPage;
