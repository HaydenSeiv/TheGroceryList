import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Layout } from "./UserLayouts";
import { BASE_URL } from "../../utils/config";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const LayoutInfo = ({ layout }: { layout: Layout }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //function to go to the selected list page onclick - user-list.tsx
  const goToList = () => {
    navigate(`/layouts/${layout.layoutId}`);
  };

  //deleteList function
  const { mutate: deleteList, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteList"],
    mutationFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/layouts/${layout.layoutId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
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
        cursor={"pointer"}
        onClick={() => goToList()}
      >
        <Text>{layout.layoutName}</Text>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Box color={"red.500"} cursor={"pointer"} onClick={() => deleteList()}>
          {!isDeleting && <MdDelete size={25} />}
          {isDeleting && <Spinner size={"sm"} />}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LayoutInfo;
