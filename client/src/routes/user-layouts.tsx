import { Container, Stack, VStack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import UserLayouts from "../components/UserLayouts";
import CreateLayoutForm from "../components/CreateLayoutForm";

export default function UserLayoutsPage() {
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
          <CreateLayoutForm />
          <UserLayouts />
        </VStack>
      </Container>
    </VStack>
  );
}
