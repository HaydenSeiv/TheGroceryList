import { Box, Text, Flex, Spacer, Button, IconButton } from "@chakra-ui/react";
import React from "react";
import { MdDelete } from "react-icons/md";
import { Aisle } from "./LayoutOrderList";

const LayoutItem = ({ aisle }: { aisle: Aisle }) => {
    return (
        <Box p={4} borderWidth={1} borderRadius={8} boxShadow="md">
            <Flex>
                <Text>{aisle.aisleName}</Text>
                <Spacer />
                <IconButton aria-label="Delete" icon={<MdDelete />} />
            </Flex>
        </Box>
    )
}

export default LayoutItem;