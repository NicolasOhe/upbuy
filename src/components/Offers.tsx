import Head from "next/head";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Offers() {
  const previews = new Array(50).fill(0).map((_, i) => {
    return {
      productId: 1234 + i,
      previewUrl: "https://loremflickr.com/640/360/laptop,sale?lock=" + i,
      productName: "Product name " + i,
      price: 43.4 + i * 2,
      currency: "EUR",
      votes: 1234 + i * 3,
      productPageURL: "",
    };
  });

  return (
    <section>
      <div className="grid grid-cols-4 gap-4 p-4">
        {previews.map((offer) => (
          <a
            className="group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg"
            href={offer.productPageURL}
          >
            <img src="" alt="" src={offer.previewUrl} />
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
