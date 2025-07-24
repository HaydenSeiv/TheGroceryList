import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./chakra/theme.ts";
import { BrowserRouter } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const BASE_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_BASE_URL : "https://grocerylistserver.azurewebsites.net/api";



const queryClient = new QueryClient();




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
