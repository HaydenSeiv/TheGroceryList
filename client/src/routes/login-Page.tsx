import {
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginForm from "../components/loginForm";
import { Toaster } from "react-hot-toast";
import AppTitle from "../components/AppTitle";
export default function LoginPage() {

  return (
    <Stack direction={`column`}>
      <Toaster position="bottom-right" />
      <AppTitle />
      <LoginForm />
    </Stack>
  );
}


