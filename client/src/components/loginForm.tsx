import { Stack, FormControl, FormLabel, Input, Box, Button, Container } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export default function LoginForm(){

    return(
        <Container>
        <Stack display="flex" alignItems="center" justifyContent="center">
        <FormControl isRequired>
          <FormLabel>First name</FormLabel>
          <Input placeholder="First name" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Last name</FormLabel>
          <Input placeholder="Last name" />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>
      </Stack>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Stack>
          <Button>
            <Link to={`/list/`}>Log In</Link>
          </Button>
        </Stack>
      </Box>
      </Container>
    )
}