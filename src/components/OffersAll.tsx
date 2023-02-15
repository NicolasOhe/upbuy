import { useInfiniteQuery } from "react-query";
import { Inter } from "@next/font/google";
import { ErrorResponse, GetPreviewsResponse } from "@/pages/api/offers";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import LikeButtons from "./LikeButtons";

interface OffersProps {
  isLoggedInUser: boolean;
}

export default function OffersAll({ isLoggedInUser }: OffersProps) {
  const [pageIndex, setPageIndex] = useState(1);

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

  const columns = 4;

  // if (isLoading) return <>Loading</>;
  // if (isError || !data) return <>Error</>;

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  console.log(" render offers");
  return (
    <div>
      <div>
        <div>
          <div className="grid grid-cols-4 gap-4 p-4">
            {allOfferPreviews.map((offer) => {
              if (!offer) return null;
              return (
                <div
                  key={offer.productId}
                  className="group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg"
                  //href={"/?productId=" + offer.productId}
                  //scroll={false}
                >
                  <img
                    alt={offer.productName}
                    src={offer.previewUrl}
                    height="250"
                    width="500"
                  />
                  <div className="p-3">
                    <div href={"/?productId=" + offer.productId} scroll={false}>
                      <h4 className="text-lg font-bold group-hover:underline">
                        {offer.productName}
                      </h4>
                    </div>
                    <p className="flex justify-between">
                      <span>{formatter.format(offer.price)}</span>
                      <span>
                        {offer.votes}{" "}
                        {isLoggedInUser && (
                          <LikeButtons productId={offer.productId} />
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
  );
}
