import { Container, Stack } from '@chakra-ui/react'
import React from 'react';
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast';
import ListOfLists from '../components/ListOfLists';

export default function UserLists() {
    return (
    <Stack h="100vh">
      
      <Navbar />
      <Toaster position="bottom-right" />
        <Container>
            <ListOfLists />
        </Container>
    </Stack>
  );
}
