import Head from 'next/head'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>reMarket</title>
        <meta name="description" content="Discover the most liked offers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <h1>Discover the most liked offers on reMarket</h1>
        <div ></div>
        <input type="checkbox" name="login" id="login" />
        <label for="login">logged in</label>
      </main>
    </>
  )
}
