import { createTheme } from "@nextui-org/react";

export const theme = createTheme({
  type: "light",
  theme: {
    colors: {
      // custom
      darkGreen: "#17706E",
      green: "#08a04b",
      lightGreen: "#90ee90",
      blueViolet: "#8A2BE2",
      pink: "#BB2297",
      powder: "#F7F7EF",

      buttonPrimary: "#BB2297",
      buttonSecondary: "#F7F7EF",

      // overrides
      background: "#17706E",
      default: "#F7F7EF",
      primary: "#90ee90",
      secondary: "#8A2BE2",
      text: "#8A2BE2",
      link: "#BB2297",
    },
    space: {},
    fonts: {
      rubik: "Rubik",
    },
  },
});
