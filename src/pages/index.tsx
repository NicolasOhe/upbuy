import Head from "next/head";
import { useState } from "react";

import Offers from "@/components/Offers";

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
      <main className="max-w-7xl m-auto px-4">
        <h1 className="text-5xl font-bold underline my-8 text-primary">
          Discover the most liked offers on reMarket
        </h1>
        <input
          type="checkbox"
          checked={isLoggedInUser}
          onChange={swithLoggingStatus}
          name="login"
          id="login"
          className="mb-8 mr-3"
        />
        <label htmlFor="login">
          logged in (Simulate logged in user vs. visitor by toogling this
          checkbox)
        </label>
        <Offers isLoggedInUser={isLoggedInUser} />
      </main>
    </>
  );
}
