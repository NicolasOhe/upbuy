import { useInfiniteQuery } from "react-query";
import React, { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import {
  ErrorResponse,
  GetPreviewsResponse,
  OfferPreview as IOfferPreview,
} from "@/pages/api/offers";
import OfferDetails from "@/components/OfferDetails";
import OfferPreview from "@/components/OfferPreview";
import LoadMore from "./LoadMore";
import { getOfferPreviews } from "@/queryResolvers/getOfferPreviews";

interface OffersProps {
  isLoggedInUser: boolean;
  initialPreviews: GetPreviewsResponse;
}

export default function Offers({
  isLoggedInUser,
  initialPreviews,
}: OffersProps) {
  const [pageIndex, setPageIndex] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<number | null>();

  const reactQueryContext = useInfiniteQuery<
    GetPreviewsResponse,
    ErrorResponse
  >("offerPreviews", getOfferPreviews, {
    initialData: { pages: [initialPreviews], pageParams: [] },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return false;
      const nextPage = pageIndex + 1;
      return nextPage;
    },
  });

  const { data } = reactQueryContext;

  const allOfferPreviews = useMemo(
    () =>
      data
        ? data.pages.reduce((acc, cur) => {
            acc.push(...cur.offerPreviews);
            return acc;
          }, [] as GetPreviewsResponse["offerPreviews"])
        : [],
    [data]
  );

  const selectedProduct = useMemo(
    () =>
      allOfferPreviews.find(
        (preview) => preview.productId === selectedProductId
      ),
    [allOfferPreviews, selectedProductId]
  );
  const parentRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef(0);

  const columns = 4;
  const columnIndexes = new Array(columns).fill(0).map((_, i) => i);

  const getOffers = (rowIndex: number) =>
    columnIndexes
      .map((i) => allOfferPreviews[rowIndex * columns + i])
      .filter(Boolean);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: Math.trunc(allOfferPreviews.length / 4) + 1,
    estimateSize: () => 200,
    scrollMargin: parentOffsetRef.current,
    overscan: 4,
  });

  const items = virtualizer.getVirtualItems();

  // if (isLoading) return <>Loading</>;
  // if (isError || !data) return <>Error</>;

  return (
    <>
      <div ref={parentRef}>
        <div
          className="w-full relative"
          style={{ height: virtualizer.getTotalSize() }}
        >
          <div
            className="w-full absolute top-0 left-0"
            style={{
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
                  className="grid grid-cols-4 gap-4 mb-4"
                >
                  {getOffers(virtualRow.index).map((offer) => (
                    <OfferPreview
                      key={offer.productId}
                      offer={offer}
                      setSelectedProductId={setSelectedProductId}
                      isLoggedInUser={isLoggedInUser}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <LoadMore
          reactQueryContext={reactQueryContext}
          setPageIndex={setPageIndex}
        />
      </div>
      <OfferDetails
        isLoggedInUser={isLoggedInUser}
        offer={selectedProduct}
        close={() => setSelectedProductId(null)}
      />
    </>
  );
}
