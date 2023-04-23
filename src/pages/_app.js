import "../styles/globals.css";
import { Rubik } from "@next/font/google";
import NextNProgress from "nextjs-progressbar";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

export default function PARADOX({ Component, pageProps }) {
  return (
    <main className={rubik.className}>
      <NextNProgress height={5} color="#BB2297" />
      <Component {...pageProps} />
    </main>
  );
}
