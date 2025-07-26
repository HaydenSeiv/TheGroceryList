import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BASE_URL } from "../main";
import ListInfo from "./ListInfo";
import toast from "react-hot-toast";

//the Item struct, matches "Item" design in both backend and database
export type List = {
  id: string;
  userId: string;
  listName: string;
  dateCreated: string;
};

const ListOfLists = () => {
  //hook to get items from database in an array
  const { data: lists, isLoading } = useQuery<List[]>({
    queryKey: ["lists"],

    //function to get items from backend and in turn database
    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + "/lists", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch lists");
        }

        const data = await res.json();

        return data || [];
      } catch (error) {
        console.error("Error fetching lists:", error);
        return [];
      }
    },
  });

  return (
    <>
      {isLoading && (
        <Flex justifyContent={"center"} my={4}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      <Text
        fontSize={"xl"}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        textAlign={"center"}
        my={2}
        color={"gray.500"}
        //bgGradient="linear(to-l, #0b85f8, #00ffff)"
        //bgClip="text"
        borderBottom="2px solid"
        borderColor="gray.500"
        pb={1}  // Padding bottom for spacing between text and line

      >
        Your Lists
      </Text>
      
      {!isLoading && (!lists || lists.length === 0) && (
        <Stack alignItems={"center"} gap="3">
          <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
            No lists found. Create your first list!
          </Text>
        </Stack>
      )}
      <Stack gap={3}>
        {lists?.map((list) => (
          <ListInfo key={list.id} list={list} />
        ))}
      </Stack>
    </>
  );
};
export default ListOfLists;
