export const buildFullPath = (path: string) => {
  const baseURL = process.env.NEXT_PUBLIC_URL;
  return `${baseURL}${path}`;
};
