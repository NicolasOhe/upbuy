import React from "react";
import Link from "next/link";

import { OfferPreview as IOfferPreview } from "@/pages/api/offers";
import LikeButtons from "@/components/LikeButtons";
import { currencyFormatter } from "@/utils/currencyFormatter";

interface OfferPreviewProps {
  isLoggedInUser: boolean;
  offer: IOfferPreview;
  setSelectedProductId: (productId: number) => void;
}

export default function OfferPreview({
  isLoggedInUser,
  offer,
  setSelectedProductId,
}: OfferPreviewProps) {
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
        className="w-full"
      />
      <div className="p-3">
        {/* Adding a query param does not trigger a rerender,
            therefore I need a state change to update the view. */}
        <Link
          href={"/?productId=" + offer.productId}
          scroll={false}
          onClick={() => setSelectedProductId(offer.productId)}
        >
          <h4 className="text-lg font-bold hover:underline">
            {offer.productName}
          </h4>
        </Link>
        <div className="flex justify-between">
          <span>{currencyFormatter.format(offer.price)}</span>
          <span>
            {offer.votes}{" "}
            {isLoggedInUser && <LikeButtons productId={offer.productId} />}
          </span>
        </div>
      </div>
    </div>
  );
}
