/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLE } from "../../auth/utils";
import { useAppDispatch, useAppSelector, useSocket } from "../../base";
import { setChats } from "../../chat";
import { ChatType, MessageType } from "../../chat/types";
import "../index.css";
import { MessageInput, MessageList } from "./LessonChatComponents";

interface LessonChatProps {
  teacherId?: string;
  studentId?: string;
}

const LessonChat = ({ teacherId, studentId }: LessonChatProps) => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { lessonId } = useParams<{
    lessonId: string;
  }>();
  const theme = useTheme();

  const { user } = useAppSelector((state) => state.auth);

  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("createNewChat", {
        lessonId,
        studentId: user?.role === ROLE.STUDENT ? user?.id : studentId,
        teacherId: user?.role === ROLE.TEACHER ? user?.id : teacherId,
      });

      socket.on("chatCreated", (chat) => {
        setChat(chat);
        socket.emit("loadMessages", { chatId: chat?.id });
      });

      socket.on("chat", (messages) => {
        if (messages) {
          setMessages(messages);
        } else {
          setMessages([]);
        }
      });

      socket.on("message", (msg) => {
        if (msg) {
          setMessages((prevMessages: MessageType[]) => [...prevMessages, msg]);
        }
        if (user?.role === ROLE.TEACHER) {
          socket.emit("getTeacherChats", { id: user?.id });
        }
      });

      socket.on("teacherChats", (receivedChats) => {
        dispatch(setChats({ data: receivedChats }));
      });

      socket.on("messageCreationError", (error) => {
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
  }, [lessonId, user, teacherId, studentId, socket]);

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
        mt: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Chats
      </Typography>
      <MessageList messages={messages} />
      <MessageInput chat={chat} />
    </Box>
  );
};

export default LessonChat;
