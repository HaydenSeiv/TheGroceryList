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
import { BASE_URL } from "../main";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
        localStorage.setItem('token', content.token);

        return content;
      } catch (error: any) {
        throw new Error(error);
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

    onError: (error: any) => {
      toast.error("Log in failed");
    },
  });

  return (
    <Container>
      <form onSubmit={loginUser}>
        <Stack display="flex" alignItems="center" justifyContent="center">
          <FormControl isRequired>
            <FormLabel textAlign={"center"}>Email</FormLabel>
            <Input placeholder="Email"
               onChange={(e) => {
                setEmail(e.target.value);
              }} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel textAlign={"center"}>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
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
              }}
            >
              Log In
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
      </form>
    </Container>
  );
}
