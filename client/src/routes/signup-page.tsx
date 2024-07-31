import { Stack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import SignUpForm from "../components/signUpForm";

export default function SignUpPage() {
  return (
  <Stack>
    <Navbar />
    <SignUpForm />
  </Stack>
  )
}
