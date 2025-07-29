import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BASE_URL } from "../main";
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import LayoutInfo from "./LayoutInfo";

//the Layout struct, matches "Layout" design in both backend and database
export type Layout = {
    layoutId: string;
    layoutName: string;
    userId: string;

};

const UserLayouts = () => {
    const {data:layouts, isLoading} = useQuery<Layout[]>({
        
        queryKey:["layouts"],
        queryFn: async () => {
            console.log("fetching layouts")
            const res = await fetch(`${BASE_URL}/layouts`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            console.log("User Layouts: ", data)
            return data
        }
    })

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
        Your Layouts
      </Text>
      <Stack gap={3}>
        {layouts?.map((layout) => (
            <LayoutInfo key={layout.layoutId} layout={layout} />
        ))}
      </Stack>
      </>
    )
}

export default UserLayouts;

