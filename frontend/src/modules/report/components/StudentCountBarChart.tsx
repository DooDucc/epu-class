import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AmountOfStudents } from "../types/sliceTypes";

interface StudentCountBarChartProps {
  data: AmountOfStudents[];
}

const StudentCountBarChart: React.FC<StudentCountBarChartProps> = ({
  data,
}) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = data.map((item) => ({
    ...item,
    monthName: monthNames[item.month - 1],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="studentCount" fill="#8884d8" name="Student" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudentCountBarChart;
