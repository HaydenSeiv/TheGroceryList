import { Stack, VStack, Container, Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import SignUpForm from "../components/signUpForm";
import { Toaster } from "react-hot-toast";
import AppTitle from "../components/AppTitle";

export default function SignUpPage() {
  return (
    <Box minH="100vh" w="100%" display="flex" flexDirection="column">
      <Container 
        maxW="md" 
        flex="1" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        px={{ base: 4, md: 6 }}
        py={{ base: 6, md: 8 }}
      >
        <VStack 
          spacing={{ base: 6, md: 8 }} 
          w="100%" 
          maxW="400px"
          align="center"
        >
          <AppTitle />
          <SignUpForm />
        </VStack>
      </Container>
    </Box>
  );
}
