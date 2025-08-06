import { Container, Stack, Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./routes/login-Page";
import React from "react";
import UserList from "./routes/user-list";
import SignUpPage from "./routes/signup-page";
import { Toaster } from "react-hot-toast";
import UserLists from "./routes/user-lists";
import ProtectedRoute from "./components/ProtectedRoute";
import UserHome from "./routes/user-home";
import UserLayoutsPage from "./routes/user-layouts";
import LayoutCreation from "./routes/layout-creation";

function App() {
  return (
    <Box minH="100vh" w="100%" overflowX="hidden">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: '14px',
            maxWidth: '90vw',
          }
        }}
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="list/" element={<UserList />} />
        <Route path="/signup/" element={<SignUpPage />} />
        <Route path="/user-home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        <Route path="/user-layouts" element={<ProtectedRoute><UserLayoutsPage /></ProtectedRoute>} />
        <Route path="/layouts/:layoutId" element={<ProtectedRoute><LayoutCreation /></ProtectedRoute>} />
        <Route path="/userlists" element={<ProtectedRoute><UserLists /></ProtectedRoute >} />
        <Route path="list/:listId" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      </Routes>
    </Box>
  );
}

export default App;
