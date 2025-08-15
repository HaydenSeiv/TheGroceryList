import { Button, Flex, Input, Spinner, Select, Box } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../../utils/config";
import React from "react";
import { Aisle } from "./LayoutOrderList";

const ItemForm = ({ listId, layoutId }: { listId: string | undefined, layoutId: string | undefined }) => {
  //state hook to create a new item name
  const [newItem, setNewItem] = useState("");

  //state hook to assign a new Aisle
  const [selectedAisleId, setSelectedAisleId] = useState("");

  const queryClient = useQueryClient(); 

  //createItem function to update backend - uses TanStack useMutation hook
  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationKey: ["createItem"],


    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!listId) {
        throw new Error("No list selected");
      }
      try {
        const token = localStorage.getItem('token');
        //we send the new items title and aisleId to the server and await for the response
        const res = await fetch(BASE_URL + "/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          //update the body with JSON of new info
          body: JSON.stringify({
            title: newItem,
            aisleId: selectedAisleId || undefined,           
            listId,
          }),
        });

        const data = await res.json();
        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        //reset the input fields to be blank
        setNewItem("");
        setSelectedAisleId("");
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },

    //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", listId] });
    },

    onError: (error: any) => {
      alert(error.message);
    },
  });

  const {data:aisles, isLoading} = useQuery<Aisle[]>({
    queryKey:["aisles"],
    queryFn: async () => {
      const res = await fetch(BASE_URL + "/aisles/" + layoutId, {
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      return data;
    }
  });

  return (
    <form onSubmit={createItem}>
      <Flex 
        gap={{ base: 2, md: 3 }} 
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "flex-start" }}
      >
        <Input
          type="text"
          value={newItem}
          placeholder="Add new item..."
          size={{ base: "md", md: "lg" }}
          borderRadius="md"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500"
          }}
          onChange={(e) => setNewItem(e.target.value)}
          ref={(input) => input && input.focus()}
          flex={{ md: 1 }}
        />
        <Select
          w={{ base: "100%", md: "200px" }}
          size={{ base: "md", md: "lg" }}
          name="selectedAisle"
          value={selectedAisleId}
          borderRadius="md"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500"
          }}
          onChange={(e) => setSelectedAisleId(e.target.value)}
          placeholder="Select Aisle"
        >  
          {aisles?.map((aisle) => (
            <option key={aisle.aisleId} value={aisle.aisleId}>
              {aisle.aisleName}
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
          loadingText="Adding..."
          _active={{
            transform: "scale(.97)",
          }}
        >
          {!isCreating && <IoMdAdd size={20} />}
          <Box ml={isCreating ? 0 : 2} display={{ base: "block", md: "none" }}>
            Add Item
          </Box>
        </Button>
      </Flex>
    </form>
  );
};
export default ItemForm;
