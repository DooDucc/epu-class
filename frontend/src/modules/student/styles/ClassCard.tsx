import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { StudentDetailClass } from "../types";

export const ClassCard: React.FC<{
  cls: StudentDetailClass;
  isSelected: boolean;
  onClick: () => void;
}> = ({ cls, isSelected, onClick }) => (
  <Card
    sx={{ width: 200, m: 1, border: isSelected ? "2px solid #1976d2" : "none" }}
  >
    <CardActionArea onClick={onClick}>
      <CardMedia
        component="img"
        height="140"
        image={cls.thumbnail}
        alt={cls.className}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {cls.classCode}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {cls.className}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
