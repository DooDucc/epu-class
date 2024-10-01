import { useEffect } from "react";
import { toast } from "react-toastify";
import { ROLE } from "../../auth/utils";
import { setChats } from "../../chat";
import { ChatType, MessageType } from "../../chat/types";
import { useAppDispatch, useAppSelector, useSocket } from "../../base";

interface UseChatSetupProps {
  lessonId: string | undefined;
  teacherId: string | undefined;
  studentId: string | undefined;
  setChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

export const useChatSetup = ({
  lessonId,
  teacherId,
  studentId,
  setChat,
  setMessages,
}: UseChatSetupProps) => {
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (socket && user) {
      socket.emit("createNewChat", {
        lessonId,
        studentId: user?.role === ROLE.STUDENT ? user?.id : studentId,
        teacherId: user?.role === ROLE.TEACHER ? user?.id : teacherId,
      });

      socket.on("chatCreated", (chat: ChatType) => {
        setChat(chat);
        socket.emit("loadMessages", { chatId: chat?.id });
      });

      socket.on("chat", (messages: MessageType[]) => {
        if (messages) {
          setMessages(messages);
        } else {
          setMessages([]);
        }
      });

      socket.on("message", (msg: MessageType) => {
        if (msg) {
          setMessages((prevMessages: MessageType[]) => [...prevMessages, msg]);
        }
        if (user?.role === ROLE.TEACHER) {
          socket.emit("getTeacherChats", { id: user?.id });
        }
      });

      socket.on("teacherChats", (receivedChats: ChatType[]) => {
        dispatch(setChats({ data: receivedChats }));
      });

      socket.on("messageCreationError", (error: Error) => {
        toast.error(error.message);
      });
    }

    return () => {
      if (socket) {
        socket.off("chat");
        socket.off("message");
        socket.off("chatCreated");
        socket.off("loadMessages");
        setChat(null);
        setMessages([]);
      }
    };
  }, [
    lessonId,
    user,
    teacherId,
    studentId,
    socket,
    dispatch,
    setChat,
    setMessages,
  ]);
};
