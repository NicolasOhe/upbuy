import Link from "next/link";
import { useRouter } from "next/router";
import LikeButtons from "./LikeButtons";

interface OffersDetailsProps {
  isLoggedInUser: boolean;
}

export default function OfferDetails({ isLoggedInUser }: OffersDetailsProps) {
  const { query } = useRouter();

  const productId = parseInt(String(query.productId));
  console.log("productId", productId);
  if (!productId || Number.isNaN(productId)) return null;
  const index = productId - 1234;

  const offer = {
    productId: productId,
    previewUrl: "https://loremflickr.com/500/250/laptop,sale?lock=" + productId,
    productName: "Product name " + (index + 1),
    price: 43.4 + index * 2,
    currency: "EUR",
    votes: 1234 + index * 3,
    productPageURL: "/offer/" + productId,
    details:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione magni eius tenetur quibusdam sapiente perferendis sunt rerum, assumenda dolores? Nihil illo temporibus saepe, voluptates facere totam voluptatibus magni distinctio blanditiis, eaque, quia a iusto dolor eveniet! Ipsa in veniam sint magnam ad doloremque sapiente! Corporis aperiam omnis officia nulla voluptates?",
  };

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-blur bg-white/50 flex justify-center items-center p-4">
      <div
        key={offer.productId}
        className="group drop-shadow-2xl bg-white rounded-lg overflow-hidden max-w-xl"
      >
        <img
          alt={offer.productName}
          src={offer.previewUrl}
          height="250"
          width="500"
          className="w-full"
        />
        <Link
          className="absolute top-5 right-5 rounded-xl bg-white px-2 hover:underline"
          href="/"
          scroll={false}
        >
          close
        </Link>
        <div className="px-3 pt-5 pb-3">
          <h4 className="text-2xl font-bold pb-1">{offer.productName}</h4>
          <p className="flex justify-between pb-3">
            <span>{formatter.format(offer.price)}</span>
            <span>
              {offer.votes}{" "}
              {isLoggedInUser && <LikeButtons productId={productId} />}
            </span>
          </p>
          <p>{offer.details}</p>
        </div>
      </div>
    </div>
  );
}
