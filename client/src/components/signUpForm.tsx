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
          return;
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

    onError: (error: any) => {
      toast.error("An Account with that email already exists");
    },
  });
  return (
    <Container>
      <form onSubmit={createUser}>
        <Stack display="flex" alignItems="center" justifyContent="center">
          <FormControl isRequired>
            <FormLabel textAlign={"center"}>First name</FormLabel>
            <Input
              placeholder="First name"
              onChange={(e) => {
                setNewFirstName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel textAlign={"center"}>Last name</FormLabel>
            <Input
              placeholder="Last name"
              onChange={(e) => {
                setNewLastName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel textAlign={"center"}>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel textAlign={"center"}>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </FormControl>          
          <FormControl isRequired isInvalid={showPasswordError}>
            <FormLabel textAlign={"center"}>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
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
              _active={{
                transform: "scale(.97)",
              }}
            >
              <Link to={`/`}>Back to Log In</Link>
            </Button>
            <Button
              mx={2}
              type="submit"
              _active={{
                transform: "scale(.97)",
              }}
            >
              {/* if createUser function is running, show loading spinner  */}
              {isCreating ? <Spinner size={"xs"} /> : "Create Account"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  );
}
