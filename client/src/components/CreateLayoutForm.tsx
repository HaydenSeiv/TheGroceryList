import { Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../../utils/config";

const CreateLayoutForm = () => {
  //state hook to create a new list name
  const [newLayout, setNewLayout] = useState("");

  const queryClient = useQueryClient();

  //createList function to update backend - uses TanStack useMutation hook
  const { mutate: createLayout, isPending: isCreating } = useMutation({
    mutationKey: ["createLayout"],

    //the mutation function is async. e is of type of Formevent
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        //we send the new list title to the server and await for the response
        const res = await fetch(BASE_URL + "/layouts", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // If you're using Bearer token
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          //update the body with JSON of new info
          body: JSON.stringify({
            layoutName: newLayout,
          }),
        });
        const data = await res.json();

        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        //reset the input box to be blank
        setNewLayout("");
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },

    onError: (error: any) => {
      alert(error.message);
    },
  });

  return (
    <>
      <Text
        fontSize={"xl"}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        textAlign={"center"}
        my={2}
        color={"gray.500"}
        //bgGradient="linear(to-l, #0b85f8, #00ffff)"
        //bgClip="text"
      >
        Create a New Layout
      </Text>
      <form onSubmit={createLayout}>
        <Flex gap={2} my={2} justifyContent={"center"}>
          <Input
            type="text"
            value={newLayout}
            onChange={(e) => setNewLayout(e.target.value)}
            ref={(input) => input && input.focus()}
          />
          <Button
            mx={2}
            type="submit"
            _active={{
              transform: "scale(.97)",
            }}
          >
            {/* if createLayout function is running, show loading spinner  */}
            {isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
          </Button>
        </Flex>
      </form>
    </>
  );
};
export default CreateLayoutForm;
