import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../main";
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
    return <div>Loading...</div>;
  }

  if (!listData || !listData.layoutId) {
    return <div>List or layout not found</div>;
  }
  const layoutId = listData.layoutId;
  return (
    <Stack h="100vh">
      <Navbar />
      <Toaster position="bottom-right" />
      <Container>
        <ItemForm listId={listId} layoutId={layoutId} />
        <ItemList listId={listId} layoutId={layoutId}/>
      </Container>
    </Stack>
  );
}
