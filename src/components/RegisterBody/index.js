// From React
import { useState } from "react";

// Styles Module
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Main Components

// Icons
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { webUrl } from "../../Common";
import { TailSpin } from "react-loader-spinner";

// Empty User (initial User)
const initialUser = {
  email: "",
  password: "",
  username: "",
};

function ResgisterBody() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSuccessFullLogin = (jwt) => {
    Cookies.set("chat_token", jwt, {
      expires: 4,
    });
    navigate("/login", {
      replace: true,
    });
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    if (!data.email && !data.password && !data.username) return;
    try {
      setLoading(true);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      let webUrl = "http://localhost:3005"
      const response = await fetch(`${webUrl}/coach/register`, options);
      const responseData = await response.json();
      console.log(responseData)
      if (response.ok) {
        onSuccessFullLogin(responseData.token);
      } else {
        setErr("Oops something went wrong...");
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.loginPageBody}>
      <form className={styles.LoginForm} onSubmit={onSubmitRegister}>
        <div className={styles.loginHeader}>
          <h1>Welcome back</h1>
          <p>Please enter your details</p>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          <input
            value={data.email}
            type="email"
            id="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="username">Username</label>
          <input
            value={data.username}
            type="text"
            id="username"
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          <div className={styles.customPasswordInput}>
            <input
              value={data.password}
              type="text"
              id="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button type="button" onClick={() => setShowPassword((n) => !n)}>
              {showPassword ? <IoMdEye size="20" /> : <IoMdEyeOff size="20" />}
            </button>
          </div>
        </div>
        {/* <Link className={styles.forgotPassordLink}>Forgot Password?</Link> */}
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? (
            <TailSpin height={30} width={30} color="white" />
          ) : err === "" ? (
            "Sign up"
          ) : (
            "Retry"
          )}
        </button>
        <button
          className={styles.registerBtn}
          type="button"
          onClick={() => navigate("/login")}>
          Already have an account? Please sign in.
        </button>
        <p className={styles.errorMsg}> {err && `*${err}`}</p>
      </form>
    </div>
  );
}

export default ResgisterBody;
