import { useInfiniteQuery } from "react-query";
import { Inter } from "@next/font/google";
import { ErrorResponse, GetPreviewsResponse } from "@/pages/api/offers";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";

const sentences = new Array(10000).fill(true).map(() => "asdfasdf afsdf asdf");

export default function Offers() {
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
        console.log("getNextPageParam");
        const nextPage = pageIndex + 1;
        //setPageIndex((i) => i + 1);
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
    if (inView && !isFetchingNextPage) {
      setPageIndex((s) => s + 1);
      fetchNextPage();
    }
  }, [inView]);

  const allOfferPreviews = data
    ? data.pages.reduce((acc, cur) => {
        acc.push(...cur.offerPreviews);
        return acc;
      }, [] as GetPreviewsResponse["offerPreviews"])
    : [];

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
  });
  const items = virtualizer.getVirtualItems();
  console.log();

  // if (isLoading) return <>Loading</>;
  // if (isError || !data) return <>Error</>;

  return (
    <div ref={parentRef} className="List">
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
                    <div className="group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg">
                      <img
                        alt={offer.productName}
                        src={offer.previewUrl}
                        height="250"
                        width="500"
                      />
                      <div className="p-3">
                        <h4 className="text-lg font-bold group-hover:underline">
                          {offer.productName}
                        </h4>
                        <p className="flex justify-between">
                          <span>
                            {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: offer.currency,
                            }).format(offer.price)}
                          </span>
                          <span>{offer.votes} 👍 👎</span>
                        </p>
                      </div>
                    </div>
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
        //disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );

  return (
    <div ref={parentRef}>
      <div
        classXName="Xgrid grid-cols-4 gap-4 p-4"
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
              items[0].start - virtualizer.options.scrollMargin
            }px)`,
          }}
        >
          {items.map((virtualRow) => {
            const offer = allOfferPreviews[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                classXName="group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg"
                href={offer.productPageURL}
              >
                <img
                  alt={offer.productName}
                  src={offer.previewUrl}
                  loading="lazy"
                  height="250"
                  width="500"
                />
                <div className="p-3">
                  <h4 className="text-lg font-bold group-hover:underline">
                    {offer.productName}
                  </h4>
                  <p className="flex justify-between">
                    <span>
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: offer.currency,
                      }).format(offer.price)}
                    </span>
                    <span>{offer.votes} 👍 👎</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => {
          setPageIndex((s) => s + 1);
          fetchNextPage();
        }}
        //disabled={!hasNextPage || isFetchingNextPage}
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
