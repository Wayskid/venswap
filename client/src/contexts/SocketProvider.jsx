import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import appContext from "./AppContext";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { userInfo } = useContext(appContext);
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BASE_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
