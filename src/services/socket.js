import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://smart-id-backend-x3ug.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

export default socket;
