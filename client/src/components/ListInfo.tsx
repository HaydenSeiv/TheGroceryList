import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/config";
import { List } from "./ListOfLists";
import { useNavigate } from "react-router-dom";

const ListInfo = ({ list }: { list: List }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //function to go to the selected list page onclick - user-list.tsx
  const goToList = () => {
    navigate(`/list/${list.id}`);
  };

  //deleteList function
  const { mutate: deleteList, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteList"],
    mutationFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/lists/${list.id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
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
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  return (
    <Flex
      gap={{ base: 2, md: 3 }}
      alignItems={"center"}
      direction={{ base: "column", sm: "row" }}
    >
      <Flex
        flex={1}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.600"}
        _dark={{ borderColor: "gray.400" }}
        p={{ base: 4, md: 4 }}
        borderRadius={"lg"}
        justifyContent={"space-between"}
        cursor={"pointer"}
        onClick={() => goToList()}
        w={{ base: "100%", sm: "auto" }}
        _hover={{
          borderColor: "blue.500",
          transform: "translateY(-1px)",
          boxShadow: "md",
        }}
        _active={{ transform: "scale(0.98)" }}
        transition="all 0.2s"
        direction={{ base: "column", md: "row" }}
        gap={{ base: 2, md: 0 }}
        minH={{ base: "60px", md: "auto" }}
      >
        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          color="blue.600"
          _dark={{ color: "blue.400" }}
          textAlign={{ base: "center", md: "left" }}
        >
          {list.listName}
        </Text>
        {/* TODO: fix, pull layout name from list from backend?*/}
        {/* <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.500"
          _dark={{ color: "gray.400" }}
          textAlign={{ base: "center", md: "right" }}
          opacity={0.8}
        >
          {list.layoutName || "No Layout"}
        </Text> */}
      </Flex>

      <Box
        color={"red.500"}
        cursor={"pointer"}
        onClick={() => deleteList()}
        p={2}
        borderRadius="md"
        _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
        _active={{ transform: "scale(0.95)" }}
        transition="all 0.2s"
        alignSelf={{ base: "center", sm: "auto" }}
      >
        {!isDeleting && <MdDelete size={20} />}
        {isDeleting && <Spinner size={"sm"} />}
      </Box>
    </Flex>
  );
};
export default ListInfo;
