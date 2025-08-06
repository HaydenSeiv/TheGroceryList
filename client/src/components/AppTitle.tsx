import React from 'react';
import { Box, Heading } from "@chakra-ui/react";

interface AppTitleProps {
  className?: string;
}

const AppTitle: React.FC<AppTitleProps> = ({ className }) => {
  return (
    <Box textAlign="center" mb={{ base: 4, md: 6 }}>
      <Heading 
        size={{ base: "lg", md: "xl" }} 
        color="green.600"
        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wide"
      >
        <Box display={{ base: "block", sm: "none" }}>Grocery List</Box>
        <Box display={{ base: "none", sm: "block" }}>The Grocery List</Box>
      </Heading>
    </Box>
  );
};

export default AppTitle; 