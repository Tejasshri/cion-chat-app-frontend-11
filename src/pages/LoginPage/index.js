import React, { useState } from "react";

import Navbar from "../../components/Navbar";

import styles from "./index.module.css";

const initialUser = {
  email: "",
  password: "",
};

function LoginPage() {
  const [data, setData] = useState(initialUser);
  return (
    <div className={styles.loginPage}>
      <Navbar isPageLogin={true} />
    </div>
  );
}

export default LoginPage;
