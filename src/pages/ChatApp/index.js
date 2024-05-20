import Body from "../../components/Body";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import { Editor } from "primereact/editor";

// Styles in module
import styles from "./index.module.css";
import PopupContext from "../../context/PopupContext";
import { useState } from "react";

export default function ChatApp() {
  const [showPopup, setShowPopup] = useState(false);

  const closeAllPopup = () => {
    setShowPopup((n) => !n);
  };

  return (
    <PopupContext.Provider
      value={{
        hidePopup: showPopup,
      }}>
      <div className={styles.chatApp} onClick={closeAllPopup}>
        <Navbar />
        <Body />
      </div>
    </PopupContext.Provider>
  );
}
