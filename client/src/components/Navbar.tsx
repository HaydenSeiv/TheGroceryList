import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
  Text,
  Container,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../main";
import toast from "react-hot-toast";

export default function Navbar() {
  //eventually want to add more features to nav bar
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  //get location and check if on list page for back button
  const location = useLocation();
  const isOnHomePage = location.pathname.startsWith("/user-home");

  //used to toggle between light and dark mode
  const { colorMode, toggleColorMode } = useColorMode();

  const { mutate: logoutUser, isPending: isLoggingout } = useMutation({
    mutationKey: ["logoutUser"],

    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(BASE_URL + `/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content = await res.json();

        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(content.error || "Something went wrong");
        }

        return content;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      //remove token from local storage
      localStorage.removeItem("token");
      queryClient.invalidateQueries({ queryKey: ["logoutUser"] });
      setTimeout(() => {
        toast.success(
          "Account logged Out succesfully, you will now be redirected to Home"
        );
      }, 2);
      navigate("/");
    },

    onError: (error: any) => {
      toast.error("Log out failed");
    },
  });

  return (
    <Container maxW={"900px"} px={{ base: 2, md: 4 }}>
      <Box
        bg={useColorModeValue("gray.400", "gray.700")}
        px={{ base: 2, md: 4 }}
        py={{ base: 2, md: 0 }}
        my={{ base: 2, md: 4 }}
        borderRadius={"5"}
      >
        <Flex 
          h={{ base: "auto", md: 16 }} 
          alignItems={"center"} 
          justifyContent={"space-between"}
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 2, sm: 0 }}
        >
          {/* Left section - hidden on mobile */}
          <Box flex={{ base: "none", sm: "1" }} display={{ base: "none", sm: "block" }}>
            {/* Empty or put back button here if you want it on the left */}
          </Box>

          {/* Center section */}
          <Box 
            flex={{ base: "none", sm: "1" }} 
            textAlign="center"
            order={{ base: 1, sm: 0 }}
          >
            <Text 
              fontSize={{ base: "lg", sm: "xl", md: "2xl" }} 
              fontWeight={"bold"} 
              color={"green.600"} 
              textTransform={"uppercase"}
              noOfLines={1}
            >
              <Box display={{ base: "block", md: "none" }}>Grocery List</Box>
              <Box display={{ base: "none", md: "block" }}>The Grocery List</Box>
            </Text>
          </Box>

          {/* Right section */}
          <Box 
            flex={{ base: "none", sm: "1" }} 
            display="flex" 
            justifyContent={{ base: "center", sm: "flex-end" }} 
            gap={{ base: 2, md: 3 }}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
            order={{ base: 2, sm: 0 }}
          >
          {!isOnHomePage && (
              <Button
                size={{ base: "sm", md: "md" }}
                mx={{ base: 0, md: 2 }}
                _active={{
                  transform: "scale(.97)",
                }}
                onClick={() => navigate("/user-home")}
              >
                <Box display={{ base: "none", md: "block" }}>Back to Home</Box>
                <Box display={{ base: "block", md: "none" }}>Back</Box>
              </Button>
            )}
            <Button
              size={{ base: "sm", md: "md" }}
              mx={{ base: 0, md: 2 }}
              _active={{
                transform: "scale(.97)",
              }}
              onClick={logoutUser}
            >
              Logout
            </Button>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
}
