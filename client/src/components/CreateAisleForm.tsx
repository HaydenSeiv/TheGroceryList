import { Button, Flex, Input, Select, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";
import { BASE_URL } from "../../utils/config";

const CreateAisleForm = ({ layoutId }: { layoutId: string }) => {
  const [newLayoutName, setNewLayoutName] = useState("");
  const [newAisle, setNewAisle] = useState("");
  const [newAisleOrder, setNewAisleOrder] = useState("");

  const queryClient = useQueryClient();

  const { mutate: addAisle, isPending: isCreating } = useMutation({
    mutationKey: ["addAisle"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(BASE_URL + "/aisles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            aisleName: newAisle,
            aisleOrder: newAisleOrder,
            layoutId: layoutId, //this is the layout id
          }),
        });
        if (!res.ok) {
          throw new Error("Failed to add aisle");
        }
        const data = await res.json();
        toast.success("Aisle added successfully");
        queryClient.invalidateQueries({ queryKey: ["layouts", layoutId] });
      } catch (error: any) {
        throw new Error(error);
      }
    },
  });

  return (
    <form onSubmit={addAisle}>
      <Flex gap={2} flexDirection={"column"}>
        <Text>
          Add Aisle or Section such as "Dairy" or "Bakery" Then select where in
          your shopping route it is located ie your first stop "1" or second "2"
        </Text>
        <Text>
          Tip: Try to be more general with your aisle or section names,
          espically with "Pantry" asiles as stores often move items around and
          you don't want to have to change your layout every time.
        </Text>
        <Input
          type="text"
          value={newAisle}
          onChange={(e) => setNewAisle(e.target.value)}
          placeholder="Enter your aisle or section name"
        />

        <Text>Enter the order of the aisle or section</Text>
        <Select
          w="240px"
          name="selectedAisle"
          value={newAisleOrder}
          onChange={(e) => {
            setNewAisleOrder(e.target.value);
          }}
          placeholder="Select 'Stop' number"
        >
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
          <option value="3">4</option>
          <option value="4">5</option>
          <option value="5">6</option>
          <option value="6">7</option>
          <option value="7">8</option>
          <option value="8">9</option>
          <option value="9">10</option>
          <option value="10">11</option>
          <option value="11">12</option>
          <option value="12">13</option>
          <option value="13">14</option>
          <option value="14">15</option>
        </Select>
        <Button type="submit" colorScheme="blue" leftIcon={<IoMdAdd />}>
          {/* if createItem function is running, show loading spinner  */}
          {isCreating ? <Spinner size={"xs"} /> : "Add Aisle"}
        </Button>
      </Flex>
    </form>
  );
};

export default CreateAisleForm;
