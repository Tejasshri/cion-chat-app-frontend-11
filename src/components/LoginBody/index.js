// From React
import { useRef, useState } from "react";

// Styles Module
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
};

function LoginBody() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSuccessFullLogin = (response) => {
    let jwt = response.token;
    if (!jwt) return setErr("Token Not Found");
    Cookies.set("chat_token", jwt, {
      expires: 4,
    });
    setTimeout(() => {
      navigate("/", {
        replace: true,
      });
    }, 2000);
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    if (!data.email && !data.password) return;
    try {
      setLoading(true);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      let webUrl = "http://localhost:3005";
      const response = await fetch(`${webUrl}/coach/login`, options);
      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData);
        onSuccessFullLogin(responseData);
      } else {
        toast.error(responseData.msg || "Oops something went wrong...");
        setErr(responseData.msg || "Oops something went wrong...");
      }
    } catch (error) {
      toast.error(error.message);
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPageBody}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
        className={styles.toastifyToastContainer}
      />
      <form className={styles.LoginForm} onSubmit={onSubmitLogin}>
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
          <label htmlFor="password">Password</label>
          <div className={styles.customPasswordInput}>
            <input
              value={data.password}
              type={showPassword ? "text" : "password"}
              id="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button type="button" onClick={() => setShowPassword((n) => !n)}>
              {showPassword ? <IoMdEye size="20" /> : <IoMdEyeOff size="20" />}
            </button>
          </div>
        </div>
        <Link className={styles.forgotPassordLink}>Forgot Password?</Link>
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? (
            <TailSpin height={30} width={30} color="white" />
          ) : err === "" ? (
            "Sign in"
          ) : (
            "Retry"
          )}
        </button>
        <button
          className={styles.registerBtn}
          type="button"
          onClick={() => navigate("/register")}>
          Don't have an account? Sign up for free.
        </button>
        <p className={styles.errorMsg}> {err && `*${err}`}</p>
      </form>
    </div>
  );
}

export default LoginBody;
