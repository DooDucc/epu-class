export const truncateLink = (url: string, maxLength: number) => {
  if (url.length <= maxLength) return url;
  const start = url.substring(0, maxLength / 2 - 2);
  const end = url.substring(url.length - maxLength / 2 + 2);
  return `${start}...${end}`;
};

export const validateLink = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
