import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import ListItem from "./ListItem";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BASE_URL } from "../main";

//the Item struct, matches "Item" design in both backend and database
export type Item = {
    _id: number;
    title: string;
    completed: boolean;
	category: string;
	catID: number; 
};

const ItemList = () => {

	//hook to get items from database in an array
    const {data:items, isLoading} = useQuery<Item[]>({
        queryKey:["items"],

		//function to get items from backend and in turn database
        queryFn: async () => {
            try {
                const res = await fetch(BASE_URL + "/items")
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

	//sort the array of items based off of Category ID, this makes it so list is in proper order of aisles.
	//In the future may want to make it so user can decided own order of aisles to match their store
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