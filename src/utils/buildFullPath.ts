export const buildFullPath = (path: string) => {
  const baseURL =
    process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  return `${baseURL}${path}`;
};
