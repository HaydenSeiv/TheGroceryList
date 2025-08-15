import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./chakra/theme.ts";
import { BrowserRouter } from "react-router-dom";

 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          // Clear auth state
          localStorage.removeItem('token');
          // Navigate to login
          window.location.href = '/login';
        }
      }
    },
    mutations: {
      onError: (error) => {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          // Clear auth state
          localStorage.removeItem('token');
          // Navigate to login
          window.location.href = '/login';
        }
      }
    }
  }
});




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
