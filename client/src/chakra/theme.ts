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
});

export default theme;