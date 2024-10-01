import React from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  useTheme,
} from "@mui/material";
import { MessageType } from "../../../chat/types";
import { formatDate } from "../../../base";
import ReactQuill from "react-quill";

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <Tooltip
      key={message?.id}
      title={formatDate(message?.createdAt)}
      placement={isCurrentUser ? "left" : "right"}
    >
      <ListItem
        alignItems="center"
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          borderRadius: theme.shape.borderRadius,
          marginBottom: theme.spacing(1),
          padding: theme.spacing(1),
          width: "fit-content",
          alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        }}
      >
        {!isCurrentUser && (
          <ListItemAvatar sx={{ minWidth: 45 }}>
            <Tooltip title={message?.sender.fullName} placement="top">
              <Avatar
                alt={message?.sender.fullName}
                src={message?.sender.avatar}
                sx={{ width: 32, height: 32 }}
              />
            </Tooltip>
          </ListItemAvatar>
        )}
        <ListItemText
          primary={
            <ReactQuill
              value={message?.content}
              readOnly={true}
              theme="bubble"
              modules={{ toolbar: false }}
              className="message-content"
            />
          }
        />
      </ListItem>
    </Tooltip>
  );
};

export default Message;
