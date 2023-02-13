import { useQuery } from "react-query";
import { Inter } from "@next/font/google";

export default function Offers() {
  const { isLoading, isError, data, error } = useQuery("todos", () =>
    fetch("api/offers?page=1&timestamp=12343").then((res) => res.json())
  );

  if (isLoading) return "Loading";
  if (isError) return "Error";

  return (
    <section>
      <div className="grid grid-cols-4 gap-4 p-4">
        {data.data.map((offer) => (
          <a
            className="group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg"
            href={offer.productPageURL}
          >
            <img
              src=""
              alt=""
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
    </section>
  );
}
