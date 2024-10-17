/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useSocket } from "../../base";
import { ChatSidebar, SelectedLessonChat } from "../components";
import "../index.css";
import { setChats } from "../redux/slice";
import { ChatType } from "../types";

const Chats = () => {
  const dispatch = useAppDispatch();

  const { lessonId: activeLessonId, studentId } = useParams<{
    lessonId: string;
    studentId: string;
  }>();

  const socket = useSocket();

  const { user } = useAppSelector((state) => state.auth);
  const {
    chat: { data: chats },
  } = useAppSelector((state) => state.chat);

  const [selectedLessonChat, setSelectedLessonChat] = useState<ChatType | null>(
    null
  );

  useEffect(() => {
    if (socket && user) {
      socket.emit("getTeacherChats", { id: user.id });

      const handleTeacherChats = (receivedChats: ChatType[]) => {
        dispatch(setChats({ data: receivedChats }));
      };

      const handleTeacherChatsError = (error: any) => {
        console.error("Error fetching teacher chats:", error);
      };

      socket.on("teacherChats", handleTeacherChats);
      socket.on("teacherChatsError", handleTeacherChatsError);

      return () => {
        socket.off("teacherChats", handleTeacherChats);
        socket.off("teacherChatsError", handleTeacherChatsError);
      };
    }
  }, [socket, user]);

  useEffect(() => {
    if (activeLessonId && studentId) {
      setSelectedLessonChat(
        chats.find(
          (chat) =>
            chat.lessonId === activeLessonId && chat.studentId === studentId
        ) || null
      );
    }
  }, [activeLessonId, chats, studentId]);

  return (
    <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <ChatSidebar
        chats={chats}
        activeLessonId={activeLessonId || ""}
        studentId={studentId || ""}
        setSelectedLessonChat={setSelectedLessonChat}
      />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {selectedLessonChat ? (
          <SelectedLessonChat selectedLessonChat={selectedLessonChat} />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              pl: "320px",
            }}
          >
            <Typography variant="body1">
              Select a lesson's chat to start
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chats;
