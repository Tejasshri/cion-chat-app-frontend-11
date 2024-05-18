// From React
import React, { useState } from "react";

// Components
import Navbar from "../../components/Navbar";
import ResgisterBody from "../../components/RegisterBody";

// Styles Module
import styles from "./index.module.css";

function RegisterPage() {
  return (
    <div className={styles.loginPage}>
      <Navbar isPageRegister={true} />
      <ResgisterBody />
    </div>
  );
}

export default RegisterPage;
