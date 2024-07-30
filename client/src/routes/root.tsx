import {
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginForm from "../components/loginForm";

export default function Root() {

  return (
    <Stack direction={`column`}>
      <Navbar />
      <LoginForm />
    </Stack>
  );
}
