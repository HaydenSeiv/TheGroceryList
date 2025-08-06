import { Container, Stack, VStack, Box } from '@chakra-ui/react'
import React from 'react';
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList';
import { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
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
