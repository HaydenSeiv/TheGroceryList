import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { BASE_URL } from "../../utils/config";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
    mutationKey: ["loginUser"],

    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(BASE_URL + `/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const content = await res.json();

        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(content.error || "Something went wrong");
        }

        //reset the input boxs to be blank
        setEmail("");
        setPassword("");

        // Store the token
        localStorage.setItem("token", content.token);

        return content;
      } catch (error: unknown) {
        throw new Error(error as string);
      }
    },
    //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
      setTimeout(() => {
        toast.success(
          "Account logged in succesfully, you will now be redirected to the list"
        );
      }, 2);
      navigate("/user-home");
    },

    onError: (error: unknown) => {
      toast.error("Log in failed");
      console.log(error);
    },
  });

  return (
    <Box w="100%">
      <form onSubmit={loginUser}>
        <Stack spacing={{ base: 4, md: 6 }} align="center">
          <FormControl isRequired>
            <FormLabel>
              Email
            </FormLabel>
            <Input
              placeholder="Enter your email"
              autoComplete="email"
              size={{ base: "md", md: "lg" }}
              borderRadius="md"              
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel          
            >
              Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              size={{ base: "md", md: "lg" }}                            
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: 3, sm: 4 }}
            w="100%"
            align="center"
            justify="center"
          >
            <Button
              type="submit"
              colorScheme="green"
              size={{ base: "md", md: "lg" }}
              w={{ base: "100%", sm: "auto" }}
              minW={{ sm: "140px" }}
              isLoading={isLoggingIn}
              loadingText="Logging in..."
              flex={{ base: "none", sm: "1" }}
              maxW={{ sm: "200px" }}
            >
              Log In
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              size={{ base: "md", md: "lg" }}
              w={{ base: "100%", sm: "auto" }}
              minW={{ sm: "140px" }}
              flex={{ base: "none", sm: "1" }}
              maxW={{ sm: "200px" }}
            >
              <Link to={`/signup/`}>Create Account</Link>
            </Button>
          </Stack>

          <ChakraLink
            as={RouterLink}
            to="/forgot-password"
            fontSize="sm"
            color="green.500"
            _hover={{ textDecoration: "underline" }}
          >
            Forgot Password?
          </ChakraLink>
        </Stack>
      </form>
    </Box>
  );
}
