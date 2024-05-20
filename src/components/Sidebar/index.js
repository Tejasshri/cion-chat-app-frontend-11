import { MdSearch } from "react-icons/md";
import { v4 } from "uuid";
import styles from "./index.module.css";
import { useContext, useEffect, useState, memo } from "react";
import ReactContext from "../../context/ReactContext";
import User from "../User";
import { webUrl } from "../../Common";
import Cookies from "js-cookie";
import PopupContext from "../../context/PopupContext";

function Sidebar() {
  const { users, setUsers, selectedUser } = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const { getOptions } = useContext(ReactContext);
  


  const getUserData = async () => {
    let token = Cookies.get("chat_token");
    try {
      setErr("");
      setIsLoading(true);
      const response = await fetch(`${webUrl}/users`, getOptions("POST"));
      if (response.ok) {
        const data = await response.json();
        console.log(data, "Okay");
        setUsers(data.data);
      } else {
        setErr("Failed to get");
      }
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getErrorView = () => {
    return (
      <div className={styles.errorView}>
        <img
          loading="eager"
          src="https://image.freepik.com/free-vector/404-error-abstract-concept-illustration_335657-2243.jpg"
          alt="error image"
        />
        <h1>Something Went Wrong</h1>
        <p>{err}</p>
        <button onClick={getUserData}>Retry</button>
      </div>
    );
  };

  return (
    <aside>
      <hr className={styles.hrLine} />
      <ul className={styles.userList}>
        {isLoading ? (
          <LoadingView />
        ) : err !== "" ? (
          getErrorView()
        ) : (
          users?.map((each) => (
            <User
              isSelected={each?._id === selectedUser?._id}
              key={v4()}
              userDetails={each}
            />
          ))
        )}
      </ul>
    </aside>
  );
}

export default memo(Sidebar);

function LoadingView() {
  let n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <>
      {n.map((each) => (
        <li key={v4()} className={styles.userPlaceholder}>
          <div className={styles.placeholderImg}></div>
          <div className={styles.placeholderText}>
            <div className={styles.placeholderH1}></div>
            <div className={styles.placeholderP}></div>
          </div>
        </li>
      ))}
    </>
  );
}
