import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import ListOfLists from "../components/ListOfLists";
import CreateListForm from "../components/CreateListForm";

export default function UserLists() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Toaster position="bottom-right" />
      <Container>
        <CreateListForm />
        <ListOfLists />
      </Container>
    </Stack>
  );
}
