import { buildFullPath } from "@/utils/buildFullPath";

export const getOfferPreviews = ({ pageParam = 1 }) =>
  fetch(buildFullPath(`/api/offers?page=${pageParam}&timestamp=12343`)).then(
    (res) => res.json()
  );
