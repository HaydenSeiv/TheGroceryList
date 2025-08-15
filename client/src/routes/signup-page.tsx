import { VStack, Container, Box } from "@chakra-ui/react";
import SignUpForm from "../components/SignUpForm";
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
