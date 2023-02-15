export const getVotes = () => fetch(`api/user/votes`).then((res) => res.json());
