export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

export const formatDateTime = (date: Date) => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
