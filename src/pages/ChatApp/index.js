import Body from "../../components/Body";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import { Editor } from "primereact/editor";

// Styles in module
import styles from "./index.module.css";

export default function ChatApp() {
  return (
    <div className={styles.chatApp}>
      <Navbar />
      <Body />
    </div>
  );
}
