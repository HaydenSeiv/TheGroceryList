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

function App() {
  return (
    <>
    <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="list/" element={<UserList />} />
        <Route path="/signup/" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default App;
