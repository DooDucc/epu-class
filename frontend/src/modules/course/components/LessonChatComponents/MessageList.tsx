/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, List, useTheme } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { MessageType } from "../../../chat/types";
import { useAppSelector } from "../../../base";
import Message from "./Message";

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const theme = useTheme();

  const { user } = useAppSelector((state) => state.auth);

  const listRef = useRef<HTMLUListElement>(null);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const scrollToBottom = () => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.scrollTop = listElement.scrollHeight;
    }
  };

  const checkIfAtBottom = () => {
    const listElement = listRef.current;
    if (listElement) {
      const isAtBottom =
        listElement.scrollHeight - listElement.scrollTop <=
        listElement.clientHeight + 1;
      setIsAtBottom(isAtBottom);
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", checkIfAtBottom);
      return () => {
        listElement.removeEventListener("scroll", checkIfAtBottom);
      };
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && isInitialLoad) {
      scrollToBottom();
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      const listElement = listRef.current;
      if (listElement) {
        const isAtBottom =
          listElement.scrollHeight - listElement.scrollTop <=
          listElement.clientHeight + 1;
        if (isAtBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <Box sx={{ position: "relative" }}>
      <List
        ref={listRef}
        sx={{
          maxHeight: 300,
          overflow: "auto",
          "& ul": { padding: 0 },
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          padding: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages?.map((message: MessageType) => {
          const isCurrentUser = message?.senderId === user?.userId;

          return (
            <Message
              key={message?.id}
              message={message}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </List>
      {showScrollButton && (
        <Button
          variant="contained"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <ArrowDownwardIcon />
        </Button>
      )}
    </Box>
  );
};

export default MessageList;
