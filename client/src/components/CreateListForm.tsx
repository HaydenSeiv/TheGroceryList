import { Button, Input, Select, Text, Box, Stack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../../utils/config";
import { Layout } from "./UserLayouts";
import { toast } from "react-hot-toast";

const CreateListForm = () => {
  //state hook to create a new list name
  const [newList, setNewList] = useState("");
  const [layout, setLayout] = useState("");

  const queryClient = useQueryClient();

  const { data: layouts, isLoading } = useQuery<Layout[]>({
    queryKey: ["layouts"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/layouts`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    },
  });

  //createList function to update backend - uses TanStack useMutation hook
  const { mutate: createList, isPending: isCreating } = useMutation({
    mutationKey: ["createList"],

    //the mutation function is async. e is of type of Formevent
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newList.trim()) {
        toast.error("Please enter a list name");
        return;
      }

      if (!layout) {
        toast.error("Please select a store layout");
        return;
      }
      try {
        //we send the new list title to the server and await for the response
        const res = await fetch(BASE_URL + "/lists", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // If you're using Bearer token
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          //update the body with JSON of new info
          body: JSON.stringify({
            listName: newList,
            layoutId: layout,
          }),
        });
        const data = await res.json();
        console.log(data);

        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        //reset the input box to be blank
        setNewList("");
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },

    onError: (error: any) => {
      alert(error.response.data.message);
      toast.error(error.response.data.message);
    },
  });

  return (
    <Box w="100%">
      <Text
        fontSize={{ base: "lg", md: "xl" }}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        textAlign={"center"}
        mb={{ base: 4, md: 6 }}
        color={"gray.500"}
        _dark={{ color: "gray.400" }}
      >
        Create a New List
      </Text>
      <form onSubmit={createList}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 3, md: 2 }}
          align={{ base: "stretch", md: "flex-end" }}
        >
          <Input
            type="text"
            value={newList}
            placeholder="Enter list name"
            size={{ base: "md", md: "lg" }}
            borderRadius="md"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px blue.500",
            }}
            onChange={(e) => setNewList(e.target.value)}
            ref={(input) => input && input.focus()}
          />
          <Select
            placeholder="Select Store Layout"
            size={{ base: "md", md: "lg" }}
            borderRadius="md"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px blue.500",
            }}
            onChange={(e) => {
              setLayout(e.target.value);
            }}
          >
            {layouts?.map((layout) => (
              <option key={layout.layoutId} value={layout.layoutId}>
                {layout.layoutName}
              </option>
            ))}
          </Select>
          <Button
            type="submit"
            colorScheme="blue"
            size={{ base: "md", md: "lg" }}
            minW={{ base: "100%", md: "auto" }}
            px={{ md: 6 }}
            isLoading={isCreating}
            loadingText="Creating..."
            _active={{
              transform: "scale(.97)",
            }}
          >
            {!isCreating && <IoMdAdd size={20} />}
            <Box
              ml={isCreating ? 0 : 2}
              display={{ base: "block", md: "none" }}
            >
              Create List
            </Box>
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
export default CreateListForm;
