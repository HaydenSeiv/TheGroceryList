import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export default function Root(props) {
  const { loggedIn, email } = props;

  const onButtonClick = () => {};

  return (
    <Stack direction={`column`}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Stack>
        <Text>
            This is the Welcome page
        </Text>
        <Text>
            Please Click below to view list
        </Text>
        <Button>
            <Link to={`list/`}>Log In</Link>
        </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
