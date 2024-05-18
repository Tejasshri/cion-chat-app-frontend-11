import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { webUrl } from "./Common";

const socket = io(webUrl, {
  auth: {
    token: Cookies.get("chat_token"),
  },
  autoConnect: false,
});

export default socket;

// import { io } from "socket.io-client";
// import { webUrl } from "./Common";

// const socket = io(webUrl, {
//   autoConnect: false,
// });

// export default socket;
