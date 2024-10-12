import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  appPaths,
  getPlainTextFromHTML,
  useAppDispatch,
  useAppSelector,
  useSocket,
} from "../../base";
import "../index.css";
import { setChats } from "../redux/slice";
import { ChatType } from "../types";

interface ChatSidebarProps {
  chats: ChatType[];
  activeLessonId: string;
  setSelectedLessonChat: (chat: ChatType) => void;
}

const ChatSidebar = ({
  chats,
  activeLessonId,
  setSelectedLessonChat,
}: ChatSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const { user } = useAppSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm?.trim() && socket) {
      socket?.emit("getTeacherChats", {
        teacherId: user?.userId,
        searchTerm: debouncedSearchTerm,
      });

      const handleTeacherChats = (receivedChats: ChatType[]) => {
        dispatch(setChats({ data: receivedChats }));
      };

      socket.on("teacherChats", handleTeacherChats);

      return () => {
        socket.off("teacherChats", handleTeacherChats);
      };
    }
  }, [debouncedSearchTerm, socket, user?.userId, dispatch]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.student.user.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      chat.lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lesson.course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      chat.lesson.course.class.className
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chat: ChatType) => {
    setSelectedLessonChat(chat);
    navigate(`${appPaths.TEACHER_CHAT}/lesson/${chat.lessonId}`);
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "fixed",
        top: 70,
        width: 300,
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 1, pb: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            flex: 1,
            overflow: "auto",
          }}
        >
          {filteredChats.map((chat, index) => {
            const lastMessage = chat.messages[0];
            const isCurrentUser = lastMessage?.senderId === user?.userId;

            return (
              <React.Fragment key={chat.id}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    transition: "background-color 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      boxShadow: 1,
                    },
                    backgroundColor:
                      activeLessonId === chat.lessonId.toString()
                        ? "action.selected"
                        : "inherit",
                  }}
                  onClick={() => handleChatClick(chat)}
                >
                  <Typography
                    sx={{ display: "inline", p: 2, pb: 0 }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {chat.lesson.course.class.className} -{" "}
                    {chat.lesson.course.title} - {chat.lesson.title}
                  </Typography>
                  <ListItem
                    alignItems="center"
                    sx={{ cursor: "pointer", gap: "8px" }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Student:
                    </Typography>
                    <ListItemAvatar sx={{ minWidth: 30 }}>
                      <Avatar
                        alt={chat.student.user.fullName}
                        src={chat.student.user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.student.user.fullName}
                      sx={{
                        "& .MuiListItemText-primary": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "120px",
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem
                    alignItems="center"
                    sx={{ cursor: "pointer", gap: "8px", pt: 0 }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {isCurrentUser ? "You" : chat.student.user.fullName}:
                    </Typography>
                    <ListItemText
                      primary={
                        <>
                          {chat.messages.length > 0 && (
                            <Typography variant="body2" noWrap>
                              {getPlainTextFromHTML(
                                DOMPurify.sanitize(lastMessage.content)
                              )}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                </Box>
                {index < filteredChats.length - 1 && (
                  <Divider variant="fullWidth" component="li" />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default ChatSidebar;
