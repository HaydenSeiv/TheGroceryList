import { Badge, Box, Flex, Spinner, Text, Grid, GridItem } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Item } from "./ItemList.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import React from "react";

const ListItem = ({ item }: { item: Item }) => {
  const queryClient = useQueryClient();

  //console.log(item); //console log used to see items coming back

  //updateItem function used to complete items
  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async () => {

      //may want to set up in future so that you can uncheck item, right now it is only one way street
      if (item.completed) return alert("Item is already completed");
      try {
        //get item from db, for some reason it works with ".id" which is how it is in backend and not "._id" which is what is used in database and Item struct
        const res = await fetch(BASE_URL + `/items/${item.id}`, {
          method: "PATCH", //using patch to update, our PATCH handler in backend auto marks as completed
        });

        //data is assigned the returned json
        const data = await res.json();

        //if response is not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    },

     //onsuccess we invalidate the query to make sure nothing is fetched again or sent by accident as it has been completed and is now out of date
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });


  //deleteItem function 
  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: async () => {
      try {
        //get item from db, for some reason it works with ".id" which is how it is in backend and not "._id" which is what is used in database and Item struct
        const res = await fetch(BASE_URL + `/items/${item.id}`, {
          method: "DELETE", //Delete handler in back end just deletes the entire item
        });
        const data = await res.json();

         //if response is not ok, throw error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    //get item from db, for some reason it works with ".id" which is how it is in backend and not "._id" which is what is used in database and Item struct
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <Flex gap={2} alignItems={"center"}>
      <Grid
        //flex={1}
        templateColumns={"repeat(6, 1fr)"}
        gap={2}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.600"}
        p={2}
        borderRadius={"lg"}
        justifyContent={"space-between"}
      >
        <GridItem
          color={item.completed ? "green.200" : "yellow.100"}
          textDecoration={item.completed ? "line-through" : "none"}    
          colSpan={3}      
        >
          {item.title}
        </GridItem>
        <GridItem
          color={item.completed ? "green.200" : "tomato"}
          textDecoration={item.completed ? "line-through" : "none"}
          colSpan={2}

        >
          {item.category}
        </GridItem>
        {item.completed && (
          <GridItem>
          <Badge ml="1" colorScheme="green">
            Done
          </Badge>
          </GridItem>
        )}
        {!item.completed && (
          <GridItem>
          <Badge ml="1" colorScheme="yellow">
            In Progress
          </Badge>
          </GridItem>
        )}
      </Grid>
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
