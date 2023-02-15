// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { products } from "../offers";

type Vote = {
  productId: number;
  value: number;
};

type Votes = Record<Vote["productId"], Vote["value"]>;

export interface GetVotesResponse {
  votes: Votes;
}

interface ErrorInfo {
  type: number;
  message: string;
}

export interface ErrorResponse {
  errors: ErrorInfo[];
}

export interface OkResponse {
  status: string;
}

const answerDelayMs = 500;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetVotesResponse | ErrorResponse | OkResponse>
) {
  const { method } = req;
  const votes: Votes = {};

  if (method === "GET") {
    new Array(products).fill(0).forEach((v, i) => {
      if ((i * 19 + 7) % 5 === 0) {
        votes[i + 1234] = Math.trunc(((i * 19 + 7) % 2) * 2 - 1);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, answerDelayMs));
    res.status(200).json({ votes });
  } else if (method === "POST") {
    res.status(201).json({ status: "ok" });
  }
}
