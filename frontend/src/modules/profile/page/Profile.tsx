import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { convertBase64, useAppDispatch, useAppSelector } from "../../base";
import { uploadFile } from "../../class/redux/actions";
import { updateUserProfile } from "../actions";
import { getProfile } from "../../auth/redux/actions";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!user) {
    return <Typography>No user information available.</Typography>;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertBase64(file);
      dispatch(
        uploadFile({
          file: base64,
          handleUploading: () => {
            setIsUploading(true);
          },
          handleSuccess: (thumbnail: string) => {
            updateUserProfile({ avatar: thumbnail, userId: user.userId }).then(
              (res) => {
                if (res) {
                  dispatch(getProfile({}));
                  toast.success("Update profile successfully");
                } else {
                  toast.error("Failed to update profile");
                }
              }
            );
            setIsUploading(false);
          },
          handleFail: () => {
            setIsUploading(false);
            toast.error("Failed to upload avatar");
          },
        })
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          padding: 0,
          marginTop: 4,
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            height: 150,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            display: "flex",
            alignItems: "flex-end",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "white", position: "absolute", top: 20, left: 20 }}
          >
            Profile User
          </Typography>
          <PersonIcon
            sx={{
              color: "white",
              fontSize: 100,
              position: "absolute",
              right: 20,
              top: 20,
              opacity: 0.5,
            }}
          />
        </Box>
        <Box sx={{ display: "flex", padding: 3, alignItems: "center" }}>
          <Box
            sx={{
              position: "relative",
              marginRight: 3,
              marginTop: -8,
            }}
            onMouseEnter={() => !isUploading && setIsHovering(true)}
            onMouseLeave={() => !isUploading && setIsHovering(false)}
          >
            <Avatar
              src={user.avatar}
              alt={user.fullName}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid white",
                position: "relative",
              }}
            >
              {!user.avatar && user.fullName[0]}
            </Avatar>
            {isUploading && (
              <CircularProgress
                size={80}
                thickness={2}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-40px",
                  marginLeft: "-40px",
                  zIndex: 1,
                }}
              />
            )}
            {isHovering && !isUploading && (
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 15,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
                onClick={handleAvatarClick}
              >
                <CameraAltIcon sx={{ color: "white" }} />
              </IconButton>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </Box>
          <Box
            sx={{
              marginTop: -4,
            }}
          >
            <Typography variant="h5">{user.fullName}</Typography>
            {user.email && (
              <Typography variant="subtitle1" color="text.secondary">
                Email: {user.email}
              </Typography>
            )}
            {user.studentCode && (
              <Typography variant="subtitle1" color="text.secondary">
                Student Code: {user.studentCode}
              </Typography>
            )}
            {user.class && (
              <Typography variant="subtitle1" color="text.secondary">
                Class: {user.class}
              </Typography>
            )}
            <Typography variant="body1" color="text.secondary">
              Phone: {user.phone}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ marginLeft: "auto" }}
          >
            Edit profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
