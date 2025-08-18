import { Flex, Spinner, Stack, Text, Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/config";
import ListInfo from "./ListInfo";

//the Item struct, matches "Item" design in both backend and database
export type List = {
  id: string;
  userId: string;
  listName: string;
  dateCreated: string;
  layoutId: string;
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
    <Box w="100%">
      {isLoading && (
        <Flex justifyContent={"center"} my={{ base: 6, md: 8 }}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      <Text
        fontSize={{ base: "lg", md: "xl" }}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        textAlign={"center"}
        mb={{ base: 4, md: 6 }}
        color={"gray.500"}
        _dark={{ color: "gray.400" }}
        borderBottom="2px solid"
        borderColor="gray.500"
        pb={2}
      >
        Your Lists
      </Text>

      {!isLoading && (!lists || lists.length === 0) && (
        <Stack
          alignItems={"center"}
          spacing={{ base: 4, md: 6 }}
          py={{ base: 8, md: 12 }}
        >
          <Text
            fontSize={{ base: "md", md: "lg" }}
            textAlign={"center"}
            color={"gray.500"}
            _dark={{ color: "gray.400" }}
            maxW="300px"
          >
            No lists found. Create your first list above to get started!
          </Text>
        </Stack>
      )}

      <Stack spacing={{ base: 3, md: 4 }}>
        {lists?.map((list) => (
          <ListInfo key={list.id} list={list} />
        ))}
      </Stack>
    </Box>
  );
};
export default ListOfLists;
