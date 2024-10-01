import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { validateLink } from "../../utils";

interface SubmitLinkModalProps {
  openLinkModal: boolean;
  setOpenLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmittedItems: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        url: string;
        type: string;
      }[]
    >
  >;
}

const SubmitLinkModal = ({
  openLinkModal,
  setOpenLinkModal,
  setSubmittedItems,
}: SubmitLinkModalProps) => {
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);
    if (newLink && !validateLink(newLink)) {
      setLinkError("Please enter a valid URL");
    } else {
      setLinkError(null);
    }
  };

  const handleLinkSubmit = () => {
    if (validateLink(link)) {
      setSubmittedItems((prev) => [
        ...prev,
        { name: link, url: link, type: "link" },
      ]);
      setOpenLinkModal(false);
    } else {
      setLinkError("Please enter a valid URL");
    }
  };

  return (
    <Dialog open={openLinkModal} onClose={() => setOpenLinkModal(false)}>
      <DialogTitle>Submit Link</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Paste your link here"
          type="url"
          fullWidth
          value={link}
          onChange={handleLinkChange}
          error={!!linkError}
        />
        {linkError && <FormHelperText error>{linkError}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenLinkModal(false)}>Cancel</Button>
        <Button onClick={handleLinkSubmit} disabled={!link || !!linkError}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default SubmitLinkModal;
