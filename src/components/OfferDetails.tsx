import { OfferPreview } from "@/pages/api/offers";
import Link from "next/link";

import LikeButtons from "@/components/LikeButtons";
import { currencyFormatter } from "@/utils/currencyFormatter";

interface OffersDetailsProps {
  isLoggedInUser: boolean;
  offer?: OfferPreview;
  close: () => void;
}

export default function OfferDetails({
  isLoggedInUser,
  offer: offerPreview,
  close,
}: OffersDetailsProps) {
  if (!offerPreview) return null;

  // TO DO: fech additional data from server
  const offer = {
    ...offerPreview,
    details:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione magni eius tenetur quibusdam sapiente perferendis sunt rerum, assumenda dolores? Nihil illo temporibus saepe, voluptates facere totam voluptatibus magni distinctio blanditiis, eaque, quia a iusto dolor eveniet! Ipsa in veniam sint magnam ad doloremque sapiente! Corporis aperiam omnis officia nulla voluptates?",
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-blur bg-white/50 flex justify-center items-center p-4">
      <div
        key={offer.productId}
        className="group drop-shadow-2xl bg-white rounded-lg overflow-hidden max-w-xl relative"
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
          onClick={close}
        >
          close
        </Link>
        <div className="px-3 pt-5 pb-3">
          <h4 className="text-2xl font-bold pb-1">{offer.productName}</h4>
          <p className="flex justify-between pb-3">
            <span>{currencyFormatter.format(offer.price)}</span>
            <span>
              {offer.votes}{" "}
              {isLoggedInUser && <LikeButtons productId={offer.productId} />}
            </span>
          </p>
          <p>{offer.details}</p>
        </div>
      </div>
    </div>
  );
}
