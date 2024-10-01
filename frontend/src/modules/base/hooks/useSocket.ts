import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "..";
import { SOCKET_URL } from "../../../envVariables";

const SOCKET_SERVER_URL = SOCKET_URL || "http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_SERVER_URL, {
        query: { userId: user.id },
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return socket;
};
