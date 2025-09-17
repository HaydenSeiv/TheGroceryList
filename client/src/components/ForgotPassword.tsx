// client/src/components/ForgotPasswordForm.tsx
import {
    Stack,
    FormControl,
    FormLabel,
    Input,
    Box,
    Button,
    Text,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useMutation } from "@tanstack/react-query";
  import toast from "react-hot-toast";
import { BASE_URL } from "../../utils/config";
  
  export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
  
    const { mutate: sendResetEmail, isPending } = useMutation({
      mutationFn: async (e: React.FormEvent) => {
        e.preventDefault();
        try {            
          const res = await fetch(BASE_URL + `/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const content = await res.json();
          if (!res.ok) {
            throw new Error(content.error || "Something went wrong");
          }
          return content;
        } catch (error: unknown) {
          throw new Error(error as string);
        }
      },
      onSuccess: () => {
        toast.success("Reset email sent! Check your inbox.");
        setEmail("");
      },
      onError: () => {
        toast.error("Failed to send reset email");
      },
    });
  
    return (
      <Box w="100%">
        <form onSubmit={sendResetEmail}>
          <Stack spacing={{ base: 4, md: 6 }} align="center">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>  
              <Input
                size="formDefault"          
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="green"
              size={{ base: "md", md: "lg" }}
              isLoading={isPending}
              loadingText="Sending..."
              w="100%"
            >
              Send Reset Email
            </Button>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              If you don't receive an email, please check your spam or junk folder.
            </Text>
          </Stack>
        </form>
      </Box>
    );
  }