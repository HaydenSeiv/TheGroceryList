import { extendTheme } from "@chakra-ui/react";

// const config: ThemeConfig = {
// 	initialColorMode: "dark",
// 	useSystemColorMode: true,
// };

// 3. extend the theme
const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        backgroundColor: "gray.800",
        color: "white",
      },
    }),
  },
  // Add component-specific styles here
  components: {
    FormLabel: {
      baseStyle: {
        textAlign: "center",
        fontSize: { base: "sm", md: "md" },
        fontWeight: "medium",
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
          _focus: {
            borderColor: "green.500",
            boxShadow: "0 0 0 1px green.500",
          },
        },
      },
      sizes: {
        formDefault: {
          field: {
            fontSize: { base: "md", md: "lg" },
          },
        },
      },
    },
    Button: {
      baseStyle: {
        _active: {
          transform: "scale(.97)",
        },
      },
    },
  },
});

export default theme;
