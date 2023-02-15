import { buildFullPath } from "@/utils/buildFullPath";

export const postVote = (vote: any) =>
  fetch(buildFullPath(`/api/user/votes`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vote),
  }).then((res) => res.json());
