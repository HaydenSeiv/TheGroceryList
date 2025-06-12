import { Container, Stack } from '@chakra-ui/react'
import React from 'react';
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList';
import { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function UserList() {
    const { listId } = useParams();
    
    return (
    <Stack h="100vh">
      
      <Navbar />
      <Toaster position="bottom-right" />
        <Container>
          <ItemForm listId={listId} />
          <ItemList listId={listId} />
        </Container>
    </Stack>
  );
}
