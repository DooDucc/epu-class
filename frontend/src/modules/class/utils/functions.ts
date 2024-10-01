export const generateClassCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 10 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

export const formatDuration = (totalSeconds: number): string => {
  const formatUnit = (value: number, unit: string) =>
    `${value} ${unit}${value !== 1 ? "s" : ""}`;

  if (totalSeconds < 60) return formatUnit(totalSeconds, "second");
  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${formatUnit(minutes, "minute")}${
      seconds > 0 ? ` ${formatUnit(seconds, "second")}` : ""
    }`;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  return `${formatUnit(hours, "hour")}${
    remainingMinutes > 0 ? ` ${formatUnit(remainingMinutes, "minute")}` : ""
  }`;
};
