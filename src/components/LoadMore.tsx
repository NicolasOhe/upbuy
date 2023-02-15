import { UseInfiniteQueryResult } from "react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { ErrorResponse, GetPreviewsResponse } from "@/pages/api/offers";

interface LoadMoreProps {
  reactQueryContext: UseInfiniteQueryResult<GetPreviewsResponse, ErrorResponse>;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function LoadMore({
  reactQueryContext,
  setPageIndex,
}: LoadMoreProps) {
  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    reactQueryContext;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 100% 0px",
  });

  useEffect(() => {
    if (inView && !isFetching && !isFetchingNextPage && hasNextPage) {
      setPageIndex((s) => s + 1);
      fetchNextPage();
    }
  }, [
    inView,
    setPageIndex,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  ]);

  return (
    <div className="flex justify-center my-7">
      <button
        ref={ref}
        onClick={() => {
          setPageIndex((s) => s + 1);
          fetchNextPage();
        }}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
}
