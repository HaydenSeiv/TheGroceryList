import { Container, Stack, VStack, Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import ListOfLists from "../components/ListOfLists";
import CreateListForm from "../components/CreateListForm";

export default function UserLists() {
  return (
    <VStack minH="100vh" spacing={0} w="100%">
      <Navbar />
      <Container 
        maxW="900px" 
        flex="1" 
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <CreateListForm />
          <ListOfLists />
        </VStack>
      </Container>
    </VStack>
  );
}
