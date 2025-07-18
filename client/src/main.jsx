import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./chakra/theme.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error-page.tsx";
import UserList from "./routes/user-list.tsx";
import LoginPage from "./routes/login-Page.tsx";
import SignUpPage from "./routes/signup-page.tsx";
import { Toaster } from "react-hot-toast";
import UserLists from "./routes/user-lists.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3999/api" : "/api";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "list/:listId",
    element: <UserList />,
  },
  {
    path: "/signup/",
    element: <SignUpPage />,
  },
  {
    path: "/userlists/",
    element: <UserLists />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Toaster position="bottom-right" />
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
