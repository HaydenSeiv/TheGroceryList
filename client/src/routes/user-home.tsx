import { Container, VStack } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import HomeMenu from '../components/homeMenu';

export default function UserHome() {
       
    return (
    <VStack minH="100vh" spacing={0} w="100%">
      <Navbar />
      <Container 
        maxW="900px" 
        flex="1" 
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <HomeMenu />
      </Container>
    </VStack>
  );
}
