import { Button, Flex, Input, Spinner, Select} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../main";
import React from "react";
import { Aisle } from "./LayoutOrderList";

const ItemForm = ({ listId, layoutId }: { listId: string | undefined, layoutId: string | undefined }) => {
  //state hook to create a new item name
  const [newItem, setNewItem] = useState("");

  //state hook to asign a new Aisle
  const [assignedAisle, setAssignedAisle] = useState("None");

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
        //we send the new items title,Category and CatID to the server and await for the response
        const res = await fetch(BASE_URL + "/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          //update the body with JSON of new info
          body: JSON.stringify({
            title: newItem,
            category: assignedAisle,           
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
          value={assignedAisle}
          onChange={(e) => {
            setAssignedAisle(e.target.value);
          }}
          placeholder="Select Aisle"
        >  {aisles?.map((aisle) => (
            <option key={aisle.aisleId} value={aisle.aisleOrder}>
              {aisle.aisleName}
            </option>
          ))}
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
