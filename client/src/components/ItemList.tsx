import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import ListItem from "./ListItem";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export type Item = {
    _id: number;
    title: string;
    completed: boolean;
	category: string;
	catID: number; 
};

const ItemList = () => {
    const {data:items, isLoading} = useQuery<Item[]>({
        queryKey:["items"],

        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:4000/api/items")
                const data = await res.json()

                if(!res.ok){
                    throw new Error(data.error || "Something went wrong")
                }
				
                return data || []
            } catch (error) {
                console.log(error)
            }
        }
    })

	items?.sort((a, b) => a.catID - b.catID)

	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}
            bgGradient='linear(to-l, #0b85f8, #00ffff)'
            bgClip='text'
            >
				Grocery List
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && items?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All items completed! 🤞
					</Text>
					{/* <img src='/go.png' alt='Go logo' width={70} height={70} /> */}
				</Stack>
			)}
			<Stack gap={3}>
				{items?.map((item) => (
					<ListItem key={item._id} item={item} />
				))}
			</Stack>
		</>
	);
};
export default ItemList;