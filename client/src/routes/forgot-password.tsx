// client/src/components/ForgotPasswordForm.tsx
import {
    Stack,
    FormControl,
    FormLabel,
    Input,
    Box,
    Button,
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
        // Your forgot password API call
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
              <FormLabel>Email</FormLabel>  {/* Theme styles auto-apply */}
              <Input
                size="formDefault"          {/* Your custom size */}
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
          </Stack>
        </form>
      </Box>
    );
  }