import React from "react";
import { useAppSelector } from "../../base";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { School, Class, People } from "@mui/icons-material";

interface InfoCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const InfoCard = ({ title, value, icon: Icon, color }: InfoCardProps) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Box bgcolor={color} borderRadius="50%" p={1}>
        <Icon sx={{ color: "white" }} />
      </Box>
    </Box>
    <Typography variant="h4" component="div" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

const TotalInfo = () => {
  const { totalInfo } = useAppSelector((state) => state.report);

  const infoCards = [
    {
      title: "TOTAL CLASSES",
      value: totalInfo.data.classCount,
      icon: School,
      color: "primary.main",
    },
    {
      title: "TOTAL LESSONS",
      value: totalInfo.data.lessonCount,
      icon: Class,
      color: "warning.main",
    },
    {
      title: "TOTAL STUDENTS",
      value: totalInfo.data.studentCount,
      icon: People,
      color: "secondary.main",
    },
  ];

  return (
    <Grid
      container
      xs={12}
      md={12}
      spacing={3}
      mb={3}
      justifyContent="center"
      alignItems="center"
    >
      {infoCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <InfoCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TotalInfo;
