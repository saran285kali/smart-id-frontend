import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["polling"], // 🔥 FORCE POLLING (FIXES RENDER ISSUE)
});

export default socket;
