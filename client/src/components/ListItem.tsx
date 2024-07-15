import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Item } from "./ItemList.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import React from "react";

const ListItem = ({ item }: { item: Item }) => {
  const queryClient = useQueryClient();

  console.log(item);
  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationKey: ["updateItem"],    
    mutationFn: async () => {
      if (item.completed) return alert("Item is already completed");
      try {
        const res = await fetch(BASE_URL + `/items/${item.id}`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/items/${item.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <Flex gap={2} alignItems={"center"}>
      <Flex
        flex={1}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.600"}
        p={2}
        borderRadius={"lg"}
        justifyContent={"space-between"}
      >
        <Text
          color={item.completed ? "green.200" : "yellow.100"}
          textDecoration={item.completed ? "line-through" : "none"}
        >
          {item.title}
        </Text>
        {item.completed && (
          <Badge ml="1" colorScheme="green">
            Done
          </Badge>
        )}
        {!item.completed && (
          <Badge ml="1" colorScheme="yellow">
            In Progress
          </Badge>
        )}
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Box
          color={"green.500"}
          cursor={"pointer"}
          onClick={() => updateItem()}
        >
          {!isUpdating && <FaCheckCircle size={20} />}
          {isUpdating && <Spinner size={"sm"} />}
        </Box>
        <Box color={"red.500"} cursor={"pointer"} onClick={() => deleteItem()}>
          {!isDeleting && <MdDelete size={25} />}
          {isDeleting && <Spinner size={"sm"} />}
        </Box>
      </Flex>
    </Flex>
  );
};
export default ListItem;
