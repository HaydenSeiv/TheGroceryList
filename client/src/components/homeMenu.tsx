import { SimpleGrid, Button, VStack, Heading, useColorModeValue, Box, Text, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

// Define the type for menu items
interface MenuOption {
  title: string;
  description: string;
  path: string;
  colorScheme: string;
}

// Define the menu options
const menuOptions: MenuOption[] = [
  {
    title: "My Lists",
    description: "Create and view your grocery lists",
    path: "/userlists",
    colorScheme: "blue"
  },
  {
    title: "Store Layouts", 
    description: "Create and edit store layouts",
    path: "/user-layouts",
    colorScheme: "green"
  }
];

const HomeMenu = () => {
  const navigate = useNavigate();

  return (
    <Box w="100%">
      <VStack spacing={{ base: 6, md: 8 }} align="center">
        <Heading 
          size={{ base: "md", md: "lg" }}
          textAlign="center"
          color="gray.700"
          _dark={{ color: "gray.200" }}
        >
          Welcome to your Dashboard
        </Heading>
        
        <SimpleGrid 
          columns={{ base: 1, sm: 2 }} 
          spacing={{ base: 4, md: 6 }}
          w="100%"
          maxW="600px"
        >
          {menuOptions.map((option) => (
            <Button 
              key={option.title} 
              colorScheme={option.colorScheme} 
              size={{ base: "lg", md: "xl" }}
              h={{ base: "80px", md: "100px" }}
              onClick={() => navigate(option.path)}
              _active={{
                transform: "scale(.97)",
              }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              <VStack spacing={1}>
                <Text 
                  fontSize={{ base: "md", md: "lg" }} 
                  fontWeight="bold"
                >
                  {option.title}
                </Text>
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  opacity={0.8}
                  textAlign="center"
                  display={{ base: "none", sm: "block" }}
                >
                  {option.description}
                </Text>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};  

export default HomeMenu;