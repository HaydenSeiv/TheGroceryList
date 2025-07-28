import { Container, Stack } from "@chakra-ui/react";
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
import StoreLayout from "./routes/store-layout";

function App() {
  return (
    <>
    <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="list/" element={<UserList />} />
        <Route path="/signup/" element={<SignUpPage />} />
        <Route path="/user-home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        <Route path="/store-layout" element={<ProtectedRoute><StoreLayout /></ProtectedRoute>} />
        <Route path="/userlists" element={<ProtectedRoute><UserLists /></ProtectedRoute >} />
        <Route path="list/:listId" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
