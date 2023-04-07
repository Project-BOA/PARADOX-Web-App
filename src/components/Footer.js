import {
  NextUIProvider,
  Text,
  Image,
  Container,
  Grid,
  Col,
  Row,
  Spacer,
} from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

function Footer() {
  return (
    <NextUIProvider theme={theme}>
      <Grid.Container justify="center">
        <Grid>
          <Image
            width={75}
            height={75}
            src="/image/penrose-triangle-coloured-circled.png"
            alt=" Logo"
            style={{ objectFit: "cover" }}
          />
        </Grid>

        <Grid>
          <Text h3 size={20} align="center">
            Contacts Privacy
          </Text>
        </Grid>
      </Grid.Container>

      <Text h3 size={12} align="center">
        @ PARADOX 2023
      </Text>
    </NextUIProvider>
  );
}

module.exports = {
  Footer,
};
