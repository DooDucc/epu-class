import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { RichTextEditor, useAppSelector, useSocket } from "../../../base";
import { ChatType } from "../../../chat/types";

interface MessageInputProps {
  chat: ChatType | null;
}

const MessageInput = ({ chat }: MessageInputProps) => {
  const socket = useSocket();

  const { user } = useAppSelector((state) => state.auth);

  const [newMessage, setNewMessage] = useState("");

  const handleMessageChange = (message: string) => {
    setNewMessage(message);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && newMessage.trim() !== "<p><br></p>") {
      const data = {
        senderId: user?.id,
        chatId: chat?.id,
        content: newMessage,
        role: user?.role,
      };
      socket?.emit("createNewMessage", data);
      handleMessageChange("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && newMessage.trim()) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
      <RichTextEditor
        value={newMessage}
        onChange={handleMessageChange}
        onKeyPress={handleKeyPress}
      />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        sx={{ marginTop: 1, alignSelf: "flex-end" }}
        onClick={handleSendMessage}
        disabled={!newMessage.trim() || newMessage.trim() === "<p><br></p>"}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
