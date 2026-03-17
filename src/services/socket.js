import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],  // 🔥 IMPORTANT
  withCredentials: false
});

export default socket;
