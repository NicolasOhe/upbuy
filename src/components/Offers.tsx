import { useInfiniteQuery } from "react-query";
import React, { useState, useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";

import { ErrorResponse, GetPreviewsResponse } from "@/pages/api/offers";
import OfferDetails from "@/components/OfferDetails";
import OfferPreview from "@/components/OfferPreview";

interface OffersProps {
  isLoggedInUser: boolean;
}

export default function Offers({ isLoggedInUser }: OffersProps) {
  const [pageIndex, setPageIndex] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<number | null>();

  const {
    isLoading,
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<GetPreviewsResponse, ErrorResponse>(
    "offerPreviews",
    ({ pageParam = 1 }) =>
      fetch(`api/offers?page=${pageParam}&timestamp=12343`).then((res) =>
        res.json()
      ),
    {
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.hasMore) return false;
        const nextPage = pageIndex + 1;
        return nextPage;
      },
    }
  );

  const {
    ref: loadMoreRef,
    inView,
    entry,
  } = useInView({
    /* Optional options */
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

  const allOfferPreviews = data
    ? data.pages.reduce((acc, cur) => {
        acc.push(...cur.offerPreviews);
        return acc;
      }, [] as GetPreviewsResponse["offerPreviews"])
    : [];

  const selectedProduct = allOfferPreviews.find(
    (preview) => preview.productId === selectedProductId
  );
  const parentRef = React.useRef<HTMLDivElement>(null);

  const parentOffsetRef = React.useRef(0);

  const columns = 4;

  React.useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: Math.trunc(allOfferPreviews.length / 4) + 1,
    estimateSize: () => 200,
    scrollMargin: parentOffsetRef.current,
    overscan: 2,
  });
  const items = virtualizer.getVirtualItems();

  // if (isLoading) return <>Loading</>;
  // if (isError || !data) return <>Error</>;

  console.log(" render offers");
  return (
    <>
      <div ref={parentRef}>
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${
                items[0]?.start - virtualizer.options.scrollMargin
              }px)`,
            }}
          >
            {items.map((virtualRow) => {
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="grid grid-cols-4 gap-4 p-4"
                >
                  {new Array(columns).fill(true).map((_, i) => {
                    const offer =
                      allOfferPreviews[virtualRow.index * columns + i];
                    if (!offer) return null;
                    return (
                      <OfferPreview
                        offer={offer}
                        setSelectedProductId={setSelectedProductId}
                        isLoggedInUser={isLoggedInUser}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <button
          ref={loadMoreRef}
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
      <OfferDetails
        isLoggedInUser={isLoggedInUser}
        offer={selectedProduct}
        close={() => setSelectedProductId(null)}
      />
    </>
  );
}
