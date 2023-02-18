// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type OfferPreview = {
  productId: number;
  previewUrl: string;
  productName: string;
  price: number;
  currency: string;
  votes: number;
  productPageURL: string;
};

export interface OfferDetails extends OfferPreview {
  details: string;
}

export interface GetPreviewsResponse {
  offerPreviews: OfferPreview[];
  hasMore: boolean;
}

interface ErrorInfo {
  type: number;
  message: string;
}

export interface ErrorResponse {
  errors: ErrorInfo[];
}

const productsPerPage = 50;
export const products = 480;
const answerDelayMs = 100;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPreviewsResponse | ErrorResponse>
) {
  const { page, timestamp } = req.query;
  if (!page || !timestamp)
    return res.status(400).json({
      errors: [
        { type: 400, message: "Missing query parameter page or timestamp" },
      ],
    });
  if (Number.isNaN(Number(page)) || Number.isNaN(Number(timestamp)))
    return res.status(400).json({
      errors: [
        {
          type: 400,
          message: "Query parameters page and timestamp must be numbers",
        },
      ],
    });

  let productsForPage = productsPerPage;
  let isLast = false;
  console.log("productsForPage", productsForPage);

  const startIndex = (Number(page) - 1) * productsPerPage;

  if (startIndex + productsPerPage > products) {
    isLast = true;
    productsForPage = products - startIndex;
    if (productsForPage < 0) productsForPage = 0;
  }
  console.log("productsForPage", productsForPage);

  const previews = new Array(productsForPage).fill(0).map((_, i) => {
    const index = i + startIndex;

    return {
      productId: 1234 + index,
      previewUrl: "https://loremflickr.com/300/150/laptop,sale?lock=" + index,
      productName: "Product name " + (index + 1),
      price: 43.4 + index * 2,
      currency: "EUR",
      votes: 1234 - index * 3,
      productPageURL: "/offer/" + (1234 + index),
    };
  });

  await new Promise((resolve) => setTimeout(resolve, answerDelayMs));
  res.status(200).json({ offerPreviews: previews, hasMore: !isLast });
}
