import { Button, Flex, Input, Spinner, Select } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../main";
import React from "react";

const ItemForm = ({ listId }: { listId: string | undefined }) => {
  //state hook to create a new item name
  const [newItem, setNewItem] = useState("");

  //state hook to asign a new Aisle
  const [newAisle, setNewAisle] = useState("None");

  //state hook that assigns the proper Category ID based off of aisle
  const [newCatID, setNewCatID] = useState("");

  const queryClient = useQueryClient();

  //Function that takes the select category (string) and assigns the correct CatID
  function setCatID(category) {
    let catID;

    //switch case that goes through each aisle name and assigns Category ID
    switch (category) {
      case "Other":
        catID = 0;
        break;
      case "Veggie":
        catID = 1;
        break;
      case "Deli":
        catID = 2;
        break;
      case "Dairy":
        catID = 3;
        break;
      case "Frozen":
        catID = 4;
        break;
      case "Bakery":
        catID = 5;
        break;
      case "Pantry":
        catID = 6;
        break;
      default:
        catID = -1;
    }

    return catID;
  }

  //createItem function to update backend - uses TanStack useMutation hook
  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationKey: ["createItem"],

    //the mutation function is async. e is of type of Formevent
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!listId) {
        throw new Error("No list selected");
      }
      try {
        //we send the new items title,Category and CatID to the server and await for the response
        const res = await fetch(BASE_URL + "/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //update the body with JSON of new info
          body: JSON.stringify({
            title: newItem,
            category: newAisle,
            catID: newCatID,
            listId,
            completed: false
          }),
        });
        const data = await res.json();

        //if response not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        //reset the input box to be blank
        setNewItem("");
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

  return (
    <form onSubmit={createItem}>
      <Flex gap={2}>
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          ref={(input) => input && input.focus()}
        />
        <Select
          w="240px"
          name="selectedAisle"
          value={newAisle}
          onChange={(e) => {
            setNewAisle(e.target.value);
            setNewCatID(setCatID(e.target.value));
          }}
          defaultValue="None"
          placeholder="Select Aisle"
        >
          <option value="Other">Other</option>
          <option value="Veggie">Veggie/fruit</option>
          <option value="Deli">Deli/Meat</option>
          <option value="Dairy">Dairy</option>
          <option value="Frozen">Frozen</option>
          <option value="Bakery">Bakery</option>
          <option value="Pantry">Pantry</option>
        </Select>
        <Button
          mx={2}
          type="submit"
          _active={{
            transform: "scale(.97)",
          }}
        >
          {/* if createItem function is running, show loading spinner  */}
          {isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
        </Button>
      </Flex>
    </form>
  );
};
export default ItemForm;
