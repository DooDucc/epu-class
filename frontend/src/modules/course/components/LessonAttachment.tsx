import { AttachmentType } from "../../lesson/types";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

const LessonAttachment = ({
  attachments,
}: {
  attachments: AttachmentType[];
}) => {
  const theme = useTheme();

  if (attachments?.length === 0) {
    return null;
  }

  return (
    <Box sx={{ boxShadow: theme.shadows[3], p: 2, borderRadius: 2, mt: 2 }}>
      {attachments?.length > 0 && (
        <Box>
          <Typography variant="h6">Documents</Typography>
          <List disablePadding>
            {attachments?.map((attachment) => (
              <ListItem key={attachment?.id} disablePadding>
                <ListItemButton
                  component="a"
                  href={attachment?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      attachment?.name?.length > 40
                        ? `${attachment?.name.substring(0, 40)}...`
                        : attachment?.name
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default LessonAttachment;
