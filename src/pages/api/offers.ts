// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type OfferPreview = {
  productId: number;
  previewUrl: string;
  productName: string;
  price: number;
  currency: string;
  votes: number;
  productPageURL: string;
};

export interface GetPreviewsResponse {
  offerPreviews: OfferPreview[]
  hasMore: boolean
}

interface ErrorInfo {
  type: number,
  message: string
}

interface ErrorResponse {
  errors: ErrorInfo[]
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPreviewsResponse | ErrorResponse>
) {
  const { page, timestamp } = req.query;
  if (!page || !timestamp)  return res.status(400).json({ errors: [{type: 400, message: "Missing query parameter page or timestamp"}] });
  if (Number.isNaN(Number(page))|| Number.isNaN(Number(timestamp))) return res.status(400).json({ errors: [{type: 400, message: "Query parameters page and timestamp must be numbers"}] });


  const previews = new Array(50).fill(0).map((_, i) => {
    return {
      productId: 1234 + i,
      previewUrl: "https://loremflickr.com/500/250/laptop,sale?lock=" + i,
      productName: "Product name " + i,
      price: 43.4 + i * 2,
      currency: "EUR",
      votes: 1234 + i * 3,
      productPageURL: "/offer/"+(1234 + i),
    };
  });
  res.status(200).json({ offerPreviews: previews, hasMore: true });
}
