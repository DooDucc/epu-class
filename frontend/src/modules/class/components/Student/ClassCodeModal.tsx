import React from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";

interface ClassCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  className: string;
}

const ClassCodeModal: React.FC<ClassCodeModalProps> = ({
  open,
  onClose,
  onSubmit,
  className,
}) => {
  const [classCode, setClassCode] = React.useState("");

  const handleSubmit = () => {
    onSubmit(classCode);
    setClassCode("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="class-code-modal"
      aria-describedby="enter-class-code"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="class-code-modal"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Enter Class Code
        </Typography>
        <Typography id="enter-class-code" sx={{ mt: 2 }}>
          Please enter the class code to join {className}
        </Typography>
        <TextField
          fullWidth
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          margin="normal"
          placeholder="Enter class code"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={classCode.trim() === ""}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClassCodeModal;
