import { Stack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import SignUpForm from "../components/signUpForm";
import { Toaster } from "react-hot-toast";
import AppTitle from "../components/AppTitle";

export default function SignUpPage() {
  return (
    <Stack>
      <Toaster position="bottom-right" />
      <AppTitle />
      <SignUpForm />
    </Stack>
  );
}
