import styles from "./index.module.css";

import Sidebar from "../Sidebar";
import ChatSection from "../ChatSection";

export default function Body() {
  return (
    <div className={styles.body}>
      <Sidebar />
      <ChatSection />
    </div>
  );
}
