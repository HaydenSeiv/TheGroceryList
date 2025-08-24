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
  import { Link, useNavigate, useParams } from "react-router-dom";
  import { BASE_URL } from "../../utils/config";
  import { toast } from "react-hot-toast";
  
  export default function ResetPasswordForm() {
    const { token } = useParams<{ token: string }>();

    //state hook to asign new password
    const [newPassword, setNewPassword] = useState("");
  
    //state hook to confirm new password
    const [confirmPassword, setConfirmPassword] = useState("");
  
    //state hook to check if passwords match
    const passwordsMatch =
      newPassword === confirmPassword && confirmPassword !== "";
    const showPasswordError = confirmPassword !== "" && !passwordsMatch;
  
    const queryClient = useQueryClient();
  
    const navigate = useNavigate();
  
    //createItem function to update backend - uses TanStack useMutation hook
    const { mutate: resetPassword, isPending: isResetting } = useMutation({
      mutationKey: ["resetPassword"],
  
      //the mutation function is async. e is of type of Formevent
      mutationFn: async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          if (!passwordsMatch) {
            toast.error("Passwords do not match");
            throw new Error("Passwords do not match");
          }
          //we send the new items title,Category and CatID to the server and await for the response
          const res = await fetch(BASE_URL + "/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            //update the body with JSON of new info
            body: JSON.stringify({
              token: token,
              password: newPassword,
            }),
          });
          const data = await res.json();
  
          //if response not ok, throw error
          if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
          }
  
          //reset the input boxs to be blank
          setNewPassword("");
          setConfirmPassword("");
  
          return data;
        } catch (error: unknown) {
          throw new Error(error as string);
        }
      },
  
      //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setTimeout(() => {
          toast.success(
            "Account created succesfully, you will now be redirected to log in"
          );
        }, 2);
        navigate("/");
      },
    });
    return (
      <Box w="100%">
        <form onSubmit={resetPassword}>
          <Stack spacing={{ base: 4, md: 5 }} align="center">
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 4, sm: 4 }}
              w="100%"
            >
              <FormControl isRequired>
                <FormLabel
                  textAlign="center"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="medium"
                >
                  New Password
                </FormLabel>
                <Input
                  placeholder="Enter token"
                  size={{ base: "md", md: "lg" }}
                  borderRadius="md"
                  _focus={{
                    borderColor: "green.500",
                    boxShadow: "0 0 0 1px green.500",
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
                  placeholder="Confirm new password"
                  size={{ base: "md", md: "lg" }}
                  borderRadius="md"
                  _focus={{
                    borderColor: "green.500",
                    boxShadow: "0 0 0 1px green.500",
                  }}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </FormControl>
            </Stack>       
   
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
                isLoading={isResetting}
                loadingText="Resetting..."
                _active={{
                  transform: "scale(.97)",
                }}
              >
                Reset Password
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    );
  }
  