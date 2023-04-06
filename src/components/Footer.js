import { NextUIProvider, Text, Image, Container, Row } from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

function Footer() {
  return (
    <NextUIProvider theme={theme}>
      <Container>
        <Image
          width={75}
          height={75}
          src="/image/penrose-triangle-coloured-circled.png"
          alt=" Logo"
          style={{ objectFit: "cover" }}
        />

        <Text h3 size={20} align="center">
          Contacts Privacy
        </Text>
      </Container>

      <Text h3 size={20} align="center">
        @ PARADOX 2023
      </Text>
    </NextUIProvider>
  );
}

module.exports = {
  Footer,
};
