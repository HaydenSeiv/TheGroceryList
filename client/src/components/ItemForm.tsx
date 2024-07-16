import { Button, Flex, Input, Spinner, Select } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../App";
import React from "react";

const ItemForm = () => {
  const [newItem, setNewItem] = useState("");  
  const [newAisle, setNewAisle] = useState("None");
  const [newCatID, setNewCatID] = useState("");

  const queryClient = useQueryClient();


  //Function that takes the select category (string) and assigns the correct CatID
  function setCatID(category) {	

    let catID;
    switch(category){
        case 'other':
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

  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationKey: ["createItem"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(BASE_URL + "/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newItem, category: newAisle, catID: newCatID }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setNewItem("");
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },

	

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
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
        <Select w='240px' name="selectedAisle" value={newAisle}  onChange={e => {setNewAisle(e.target.value); setNewCatID(setCatID(e.target.value)) }} defaultValue="None" placeholder="Select Aisle">
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
          {isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
        </Button>
      </Flex>
    </form>
  );
};
export default ItemForm;
