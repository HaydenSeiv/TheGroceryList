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
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../main";
import { IoMdAdd } from "react-icons/io";
import {toast} from "react-hot-toast";


export default function SignUpForm() {
  //state hook to create a new first name
  const [newFirstName, setNewFirstName] = useState("");

  //state hook to asign a new Last name
  const [newLastName, setNewLastName] = useState("");

  //state hook to asign new email
  const [newEmail, setNewEmail] = useState("");

  //state hook to asign new email
  const [newPassword, setNewPassword] = useState("");

  //state hook to confirm password
  const [confirmPassword, setConfirmPassword] = useState("");

  //state hook to check if passwords match
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const showPasswordError = confirmPassword !== "" && !passwordsMatch;

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  //createItem function to update backend - uses TanStack useMutation hook
  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationKey: ["createUser"],

    //the mutation function is async. e is of type of Formevent
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!passwordsMatch) {
          toast.error("Passwords do not match");
          throw new Error("Passwords do not match");
        }
        //we send the new items title,Category and CatID to the server and await for the response
        const res = await fetch(BASE_URL + "/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //update the body with JSON of new info
          body: JSON.stringify({
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            password: newPassword,
          }),
        });
        const data = await res.json();

        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        //reset the input boxs to be blank
        setNewFirstName("");
        setNewLastName("");
        setNewEmail("");
        setNewPassword("");
        setConfirmPassword("");

        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },

    //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTimeout(() => {
        toast.success("Account created succesfully, you will now be redirected to log in")}, 2);
      navigate("/");
    },
  });
  return (
    <Box w="100%">
      <form onSubmit={createUser}>
        <Stack spacing={{ base: 4, md: 5 }} align="center">
          <Stack direction={{ base: "column", sm: "row" }} spacing={{ base: 4, sm: 4 }} w="100%">
            <FormControl isRequired>
              <FormLabel 
                textAlign="center" 
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
              >
                First name
              </FormLabel>
              <Input
                placeholder="Enter first name"
                size={{ base: "md", md: "lg" }}
                borderRadius="md"
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px green.500"
                }}
                onChange={(e) => {
                  setNewFirstName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel 
                textAlign="center" 
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
              >
                Last name
              </FormLabel>
              <Input
                placeholder="Enter last name"
                size={{ base: "md", md: "lg" }}
                borderRadius="md"
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px green.500"
                }}
                onChange={(e) => {
                  setNewLastName(e.target.value);
                }}
              />
            </FormControl>
          </Stack>

          <FormControl isRequired>
            <FormLabel 
              textAlign="center" 
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
            >
              Email address
            </FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              size={{ base: "md", md: "lg" }}
              borderRadius="md"
              _focus={{
                borderColor: "green.500",
                boxShadow: "0 0 0 1px green.500"
              }}
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel 
              textAlign="center" 
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
            >
              Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              size={{ base: "md", md: "lg" }}
              borderRadius="md"
              _focus={{
                borderColor: "green.500",
                boxShadow: "0 0 0 1px green.500"
              }}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </FormControl>          

          <FormControl isRequired isInvalid={showPasswordError}>
            <FormLabel 
              textAlign="center" 
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
            >
              Confirm Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              size={{ base: "md", md: "lg" }}
              borderRadius="md"
              _focus={{
                borderColor: "green.500",
                boxShadow: "0 0 0 1px green.500"
              }}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
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
              variant="outline"
              colorScheme="gray"
              size={{ base: "md", md: "lg" }}
              w={{ base: "100%", sm: "auto" }}
              minW={{ sm: "140px" }}
              _active={{
                transform: "scale(.97)",
              }}
            >
              <Link to={`/`}>Back to Log In</Link>
            </Button>
            <Button
              type="submit"
              colorScheme="green"
              size={{ base: "md", md: "lg" }}
              w={{ base: "100%", sm: "auto" }}
              minW={{ sm: "140px" }}
              isLoading={isCreating}
              loadingText="Creating..."
              _active={{
                transform: "scale(.97)",
              }}
            >
              Create Account
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
