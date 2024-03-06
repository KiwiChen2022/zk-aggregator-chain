import { extendTheme } from "@chakra-ui/react";

const colors = {
  ethereum: {
    50: "#F7FAFC", // light blue for backgrounds
    100: "#EDF2F7", // light backgrounds
    200: "#E2E8F0", // card backgrounds
    300: "#CBD5E0", // buttons, inactive states
    400: "#A0AEC0", // sub text
    500: "#718096", // primary text
    600: "#4A5568", // strong text, headings
    700: "#2D3748", // titles, focused states
    800: "#1A202C", // deep blue, very strong emphasis
    900: "#153E75", // ethereum blue, accents
  },
};

const fonts = {
  heading: "Nunito, sans-serif",
  body: "Nunito, sans-serif",
  mono: "Menlo, monospace",
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold", // All buttons have bold text
    },
    sizes: {
      md: {
        h: "48px", // Default size of buttons
        fontSize: "lg", // Default font size
      },
    },
    variants: {
      solid: (props) => ({
        bg: props.colorMode === "dark" ? "ethereum.900" : "ethereum.500",
        color: "white",
        _hover: {
          bg: "ethereum.700",
        },
      }),
    },
    defaultProps: {
      size: "md", // Default size for all buttons
      variant: "solid", // Default variant for all buttons
    },
  },
  Link: {
    baseStyle: (props) => ({
      color: props.colorMode === "dark" ? "ethereum.300" : "ethereum.500",
      _hover: {
        textDecoration: "underline",
      },
    }),
  },
};

const styles = {
  global: {
    // styles for the `body`
    body: {
      bg: "ethereum.50",
      color: "ethereum.800",
    },
    // styles for the `a`
    a: {
      color: "ethereum.900",
      _hover: {
        textDecoration: "underline",
      },
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
});

export default theme;
