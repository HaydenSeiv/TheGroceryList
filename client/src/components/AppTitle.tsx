import React from 'react';
import { Box, Heading } from "@chakra-ui/react";

interface AppTitleProps {
  className?: string;
}

const AppTitle: React.FC<AppTitleProps> = ({ className }) => {
  return (
    <Box textAlign="center" my={4}>
      <Heading size="xl" color="green.600">
        The Grocery List
      </Heading>
    </Box>
  );
};

export default AppTitle; 