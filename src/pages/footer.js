import { NextUIProvider, Text } from "@nextui-org/react";
import { theme } from "@/modules/theme.js";
export default function Footer() {
  return (
    <NextUIProvider theme={theme}>
      <Text h2 size={20} fonts="Roboto">
        Parad0x
      </Text>
    </NextUIProvider>
  );
}
