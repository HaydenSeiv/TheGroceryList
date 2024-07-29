import { Container, Stack } from '@chakra-ui/react'
import React from 'react';
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList';

export default function UserList() {
    return (
    <Stack h="100vh">
      
      <Navbar />
        <Container>
          <ItemForm />
          <ItemList />
        </Container>
    </Stack>
  );
}
