import Head from "next/head";
import { Inter } from "@next/font/google";
import Offers from "@/components/Offers";
import OfferDetails from "@/components/OfferDetails";
import { useState } from "react";
import OffersAll from "@/components/OffersAll";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoggedInUser, setIsLoggedInUser] = useState(true);
  const swithLoggingStatus = () => {
    setIsLoggedInUser((s) => !s);
  };
  return (
    <>
      <Head>
        <title>reMarket</title>
        <meta name="description" content="Discover the most liked offers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl font-bold underline">
          Discover the most liked offers on reMarket
        </h1>
        <input
          type="checkbox"
          checked={isLoggedInUser}
          onChange={swithLoggingStatus}
          name="login"
          id="login"
        />
        <label htmlFor="login">logged in</label>
        <Offers isLoggedInUser={isLoggedInUser} />
        {/* <OffersAll isLoggedInUser={isLoggedInUser} /> */}
        {/* <OfferDetails isLoggedInUser={isLoggedInUser} /> */}
      </main>
    </>
  );
}
