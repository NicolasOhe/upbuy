import { ErrorResponse, GetPreviewsResponse } from "@/pages/api/offers";
import { GetVotesResponse } from "@/pages/api/user/votes";
import { queryClient } from "@/pages/_app";
import { getVotes } from "@/queryResolvers/getVotes";
import { postVote } from "@/queryResolvers/postVote";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import ThumbsDown from "./ThumbsDown";
import ThumbsUp from "./ThumbsUp";

interface LikeButtonsProps {
  productId: number;
}

export default function LikeButtons({ productId }: LikeButtonsProps) {
  const { data } = useQuery<GetVotesResponse, ErrorResponse>(
    "votes",
    getVotes,
    { staleTime: 3 * 60 * 1000 }
  );

  const originalVote = data?.votes[productId] ?? 0;
  const isLiked = data?.votes[productId] === 1;
  const isDisliked = data?.votes[productId] === -1;

  const mutation = useMutation(postVote, {
    onMutate: async (vote) => {
      // Update thumbs color immediately
      queryClient.setQueryData<GetVotesResponse>("votes", (old) => {
        if (!old) return {} as GetVotesResponse;
        const newVotes = { ...old, votes: { ...old.votes } };
        newVotes.votes[vote.productId] = vote.value;
        return newVotes;
      });

      interface Paginated<T> {
        pages: T[];
      }

      // TO DO: simplify this monstruosity.
      // Update rating immediately
      queryClient.setQueryData<Paginated<GetPreviewsResponse>>(
        "offerPreviews",
        (old) => {
          if (!old) return { pages: [] };

          const updatedData = {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                offerPreviews: page.offerPreviews.map((preview) => {
                  if (preview.productId === productId) {
                    return { ...preview, votes: preview.votes + vote.dif };
                  }
                  return preview;
                }),
              };
            }),
          };
          return updatedData;
        }
      );
    },
  });

  const likeProduct = () => {
    const value = isLiked ? 0 : 1;
    const dif = value - originalVote;
    mutation.mutate({ productId, value, dif });
  };

  const dislikeProduct = () => {
    const value = isDisliked ? 0 : -1;
    const dif = value - originalVote;
    mutation.mutate({ productId, value, dif });
  };

  return (
    <div className="inline">
      <button className="w-4 mr-1" onClick={likeProduct}>
        <ThumbsUp color={isLiked ? "green" : "black"} />
      </button>
      <button className="w-4 translate-y-1" onClick={dislikeProduct}>
        <ThumbsDown color={isDisliked ? "red" : "black"} />
      </button>
    </div>
  );
}
