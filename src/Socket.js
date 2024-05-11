import { io } from "socket.io-client";
import { webUrl } from "./Common";

const socket = io(webUrl, {
  autoConnect: false,
});

export default socket;
