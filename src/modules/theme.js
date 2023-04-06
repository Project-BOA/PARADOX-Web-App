import { createTheme } from "@nextui-org/react";

export const theme = createTheme({
  type: "light",
  theme: {
    colors: {
      // overrides
      background: "#17706E",
      default: "#F7F7EF",
      primary: "#B6EB79",
      secondary: "#BB2297",
      text: "#8A2BE2",
      link: "#BB2297",

      // custom
      darkGreen: "#17706E",
      lightGreen: "#B6EB79",
      blueViolet: "#8A2BE2",
      pink: "#BB2297",
      powder: "#F7F7EF",
    },
    space: {},
    fonts: {},
  },
});
