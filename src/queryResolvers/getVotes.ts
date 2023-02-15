import { buildFullPath } from "@/utils/buildFullPath";

export const getVotes = () =>
  fetch(buildFullPath(`/api/user/votes`)).then((res) => res.json());
