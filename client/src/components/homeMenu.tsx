import { SimpleGrid, Button, VStack, Heading, useColorModeValue } from '@chakra-ui/react';
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
    <SimpleGrid columns={2} spacing={4}>
      {menuOptions.map((option) => (
        <Button key={option.title} colorScheme={option.colorScheme} onClick={() => navigate(option.path)}>
          {option.title}
        </Button>
      ))}
    </SimpleGrid>
  );
};  

export default HomeMenu;