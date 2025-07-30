import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import UserLayouts from "../components/UserLayouts";
import CreateLayoutForm from "../components/CreateLayoutForm";

export default function UserLayoutsPage() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Toaster position="bottom-right" />
      <Container>
        <CreateLayoutForm />
        <UserLayouts />
      </Container>
    </Stack>
  );
}
