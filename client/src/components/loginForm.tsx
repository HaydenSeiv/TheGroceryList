import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Container,
  Spinner,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../main";
import { IoMdAdd } from "react-icons/io";

export default function LoginForm() {  

  const queryClient = useQueryClient();

 
  return (
    <Container >
      <Stack display="flex" alignItems="center" justifyContent="center">
        <FormControl isRequired>
          <FormLabel textAlign={"center"}>Email</FormLabel>
          <Input placeholder="Email" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel textAlign={"center"}>Password</FormLabel>
          <Input placeholder="Password" />
        </FormControl>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          gap={3}
        >
          <Button
           mx={2}
           type="submit"
           _active={{
            transform: "scale(.97)",
          }}>
            <Link to={`/list/`}>Log In</Link>
          </Button>
          <Button
            mx={2}            
            _active={{
              transform: "scale(.97)",
            }}
          >
             <Link to={`/signup/`}>Create Account</Link>
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
