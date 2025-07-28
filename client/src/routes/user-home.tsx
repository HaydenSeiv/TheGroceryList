import { Container, Stack } from '@chakra-ui/react'
import React from 'react';
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList';
import { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function UserHome() {
       
    return (
    <Stack h="100vh">
      
      <Navbar />
      <Toaster position="bottom-right" />
        <Container>
        </Container>
    </Stack>
  );
}
