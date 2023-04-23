import { NextUIProvider, Link, Text } from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

export default function Custom404() {
  return (
    <NextUIProvider theme={theme}>
      <Text h1 align="center" size={50} color="black" css={{ m: 0 }}>
        Oops! You seem to be lost.
      </Text>
      <Text h1 align="center" size={50} css={{ m: 0 }}>
        Return to home Page
        <Link align="center" block href="/">
          Home
        </Link>
      </Text>
    </NextUIProvider>
  );
}
