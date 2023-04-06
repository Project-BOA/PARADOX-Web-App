import { Container } from "@nextui-org/react";
import "../styles/globals.css";
import { Rubik } from "@next/font/google";

const alkatra = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={alkatra.className}>
      <Component {...pageProps} />
    </main>
  );
}
