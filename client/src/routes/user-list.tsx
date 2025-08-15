import { Container, VStack, Spinner, Flex, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import { List } from "../components/ListOfLists";
import { useQuery } from "@tanstack/react-query";

export default function UserList() {
  const { listId } = useParams();

  //need to get the layoutId from the list data
  const { data: listData, isLoading } = useQuery<List>({
    queryKey: ["list", listId],
    enabled: !!listId,
    queryFn: async () => {
      try {
        const res = await fetch(`${BASE_URL}/lists/${listId}`, {
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  });
  
  if (isLoading) {
    return (
      <VStack minH="100vh" justify="center" align="center" spacing={4}>
        <Navbar />
        <Flex flex="1" align="center" justify="center">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading your list...</Text>
          </VStack>
        </Flex>
      </VStack>
    );
  }

  if (!listData || !listData.layoutId) {
    return (
      <VStack minH="100vh" justify="center" align="center" spacing={4}>
        <Navbar />
        <Flex flex="1" align="center" justify="center">
          <Text color="red.500" fontSize="lg">List or layout not found</Text>
        </Flex>
      </VStack>
    );
  }
  
  const layoutId = listData.layoutId;
  return (
    <VStack minH="100vh" spacing={0} w="100%">
      <Navbar />
      <Container 
        maxW="900px" 
        flex="1" 
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <ItemForm listId={listId} layoutId={layoutId} />
          <ItemList listId={listId} layoutId={layoutId}/>
        </VStack>
      </Container>
    </VStack>
  );
}
