import { Box, Flex, Spinner, Text, Input } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Item } from "./ItemList.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/config";
import React, { useState } from "react";
import { Aisle } from "./LayoutOrderList";

const ListItem = ({
  item,
  layoutId,
}: {
  item: Item;
  layoutId: string | undefined;
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);

  //completeItem function used to complete items
  const { mutate: completeItem, isPending: isCompleting } = useMutation({
    mutationKey: ["completeItem"],
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      try {
        //get item from db, for some reason it works with ".id" which is how it is in backend and not "._id" which is what is used in database and Item struct
        const res = await fetch(BASE_URL + `/items/${item.id}`, {
          method: "PATCH", //using patch to update, our PATCH handler in backend auto marks as completed
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  //updateItem function used to update item text
  const { mutate: updateItem, isPending: isupdating } = useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async (updatedTitle: string | null) => {
      const token = localStorage.getItem("token");
      try {
        //send the route we want with our ID info and the newtitle info using the PATCH hanlder in our backend
        const res = await fetch(
          BASE_URL + `/items/itemsupdate/${item.id}/${updatedTitle}`,
          {
            method: "PATCH", //using patch to update
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const { data: aisles, isLoading } = useQuery<Aisle[]>({
    queryKey: ["aisles"],
    queryFn: async () => {
      const res = await fetch(BASE_URL + "/aisles/" + layoutId, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    },
  });

  //deleteItem function
  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: async () => {
      if (item.completed)
        try {
          const token = localStorage.getItem("token");
          //get item from db, for some reason it works with ".id" which is how it is in backend and not "._id" which is what is used in database and Item struct
          const res = await fetch(BASE_URL + `/items/${item.id}`, {
            method: "DELETE", //Delete handler in back end just deletes the entire item
            headers: {
              Authorization: `Bearer ${token}`,
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
      else {
        alert("Item must be completed to delete");
      }
    },

    //get item from db, for some reason it works with ".id" which is how it is in backend and not "._id" which is what is used in database and Item struct
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  function setColor(aisleOrder: number) {
    let textColor;

    switch (aisleOrder) {
      case 0:
        textColor = "#9CD9D0";
        break;
      case 1:
        textColor = "#FB4023";
        break;
      case 2:
        textColor = "#ff9e00";
        break;
      case 3:
        textColor = "#3ecbbd";
        break;
      case 4:
        textColor = "#FFDC5E";
        break;
      case 5:
        textColor = "#A5BE00";
        break;
      case 6:
        textColor = "#9b5de5";
        break;
      case 7:
        textColor = "#00b4d8";
        break;
      case 8:
        textColor = "#9CD9D0";
        break;
      case 9:
        textColor = "#FB4023";
        break;
      case 10:
        textColor = "#f72585";
        break;
      case 11:
        textColor = "#ff9e00";
        break;
      case 12:
        textColor = "#3ecbbd";
        break;
      case 13:
        textColor = "#FFDC5E";
        break;
      case 14:
        textColor = "#A5BE00";
        break;
      case 15:
        textColor = "#FB4023";
        break;
      case 16:
        textColor = "#9b5de5";
        break;
      case 17:
        textColor = "#00b4d8";
        break;
      case 18:
        textColor = "#9CD9D0";
      default:
        textColor = "#ffffff";
    }

    return textColor;
  }

  const startEditing = () => {
    setIsEditing(true);
    setNewTitle(item.title);
  };

  const saveEdit = () => {
    if (newTitle?.trim() !== "") {
      updateItem(newTitle);
    } else {
      console.log("Input is empty");
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <Flex
      gap={{ base: 2, md: 3 }}
      alignItems={"center"}
      direction={{ base: "row", sm: "row" }}
    >
      <Flex
        flex={1}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.600"}
        _dark={{ borderColor: "gray.400" }}
        p={{ base: 3, md: 4 }}
        borderRadius={"lg"}
        justifyContent={"space-between"}
        minH={{ base: "50px", md: "auto" }}
        w={{ base: "100%", sm: "auto" }}
        direction={{ base: "row", md: "row" }}
        gap={{ base: 2, md: 0 }}
      >
        <Box
          flex={1}
          onClick={startEditing}
          cursor="pointer"
          w={{ base: "auto", md: "auto" }}
        >
          {isEditing ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              autoFocus
              size={{ base: "sm", md: "md" }}
              w="100%"
            />
          ) : (
            <Text
              color={item.completed ? "green.200" : setColor(item.aisleOrder)}
              textDecoration={item.completed ? "line-through" : "none"}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              textAlign={{ base: "left", md: "left" }}
              noOfLines={2}
            >
              {item.title}
            </Text>
          )}
        </Box>

        <Text
          color={item.completed ? "green.200" : setColor(item.aisleOrder || 0)}
          textDecoration={item.completed ? "line-through" : "none"}
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="medium"
          textAlign={{ base: "right", md: "right" }}
          minW={{ md: "80px" }}
          opacity={0.8}
        >
          {item.aisleName || "No Aisle"}
        </Text>
      </Flex>

      <Flex
        gap={{ base: 0, md: 2 }}
        alignItems={"center"}
        justify={{ base: "flex-end", sm: "flex-end" }}
        w={{ base: "auto", sm: "auto" }}
      >
        <Box
          color={"green.500"}
          cursor={"pointer"}
          onClick={() => completeItem()}
          p={2}
          ml={{ base: -1, md: 0 }}
          mr={{ base: -1, md: 0 }}
          borderRadius="md"
          _hover={{ bg: "green.50", _dark: { bg: "green.900" } }}
          _active={{ transform: "scale(0.95)" }}
          transition="all 0.2s"
        >
          {!isCompleting && <FaCheckCircle size={18} />}
          {isCompleting && <Spinner size={"sm"} />}
        </Box>
        <Box
          color={"red.500"}
          cursor={"pointer"}
          onClick={() => deleteItem()}
          p={2}
          ml={{ base: -1, md: 0 }}
          mr={{ base: -1, md: 0 }}
          borderRadius="md"
          _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
          _active={{ transform: "scale(0.95)" }}
          transition="all 0.2s"
        >
          {!isDeleting && <MdDelete size={20} />}
          {isDeleting && <Spinner size={"sm"} />}
        </Box>
      </Flex>
    </Flex>
  );
};
export default ListItem;
