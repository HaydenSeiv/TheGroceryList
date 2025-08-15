import { Box, Text, Flex, Spacer, IconButton } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { Aisle } from "./LayoutOrderList";
import { BASE_URL } from "../../utils/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LayoutItem = ({ aisle }: { aisle: Aisle }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteAisle, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteAisle"],
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(BASE_URL + `/aisles/${aisle.aisleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete aisle");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layouts", aisle.layoutId] });
    },
  });

  return (
    <Box p={4} borderWidth={1} borderRadius={8} boxShadow="md">
      <Flex>
        <Text>{aisle.aisleName}</Text>
        <Spacer />
        <Text>Aisle Order: {aisle.aisleOrder + 1} </Text>
        <Spacer />
        <IconButton
          aria-label="Delete"
          onClick={() => deleteAisle()}
          icon={<MdDelete />}
          isLoading={isDeleting}
        />
      </Flex>
    </Box>
  );
};

export default LayoutItem;
