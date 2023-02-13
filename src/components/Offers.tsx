import { useInfiniteQuery } from "react-query";
import { Inter } from "@next/font/google";
import { ErrorResponse, GetPreviewsResponse } from "@/pages/api/offers";
import { useState } from "react";

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

  if (isLoading) return <>Loading</>;
  if (isError || !data) return <>Error</>;

  return (
    <section>
      <div className="grid grid-cols-4 gap-4 p-4">
        {data.pages
          .reduce((acc, cur) => {
            acc.push(...cur.offerPreviews);
            return acc;
          }, [] as GetPreviewsResponse["offerPreviews"])
          .map((offer) => (
            <a
              className="group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg"
              href={offer.productPageURL}
            >
              <img
                alt={offer.productName}
                src={offer.previewUrl}
                height="250"
                width="500"
              />
              <div className=" p-3">
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
            </a>
          ))}
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
    </section>
  );
}
