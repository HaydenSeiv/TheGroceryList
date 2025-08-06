import { Flex, Spinner, Stack, Text, Box } from "@chakra-ui/react";
import ListItem from "./ListItem";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BASE_URL } from "../main";
import toast from "react-hot-toast";

//the Item struct, matches "Item" design in both backend and database
export type Item = {
    id: string;
	listId: string;
    title: string;
    completed: boolean;
	aisleId?: string;
	aisleName: string;
	aisleOrder?: number; 
};

const ItemList = ({ listId, layoutId }: { listId: string | undefined, layoutId: string | undefined }) => {

	//hook to get items from database in an array
    const {data:items, isLoading} = useQuery<Item[]>({
        queryKey:["items", listId],
		//function to get items from backend and in turn database
        queryFn: async () => {
            try {
                const res = await fetch(`${BASE_URL}/items/${listId}`, {          
					credentials: 'include',
					headers: {
					  'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json'
					}

				})
                const data = await res.json()				

                if(!res.ok){
					const errorData = await res.json();
					throw new Error(errorData.error || "Failed to fetch items");
                }
				
                return data || []
            } catch (error) {
                console.log(error)
				return [];
            }
        }
    })

	//sort the array of items based off of aisle order, this makes it so list is in proper order of aisles.
	//Items without aisles will appear at the end
	items?.sort((a, b) => {
		if (a.aisleOrder == null && b.aisleOrder == null) return 0;
		if (a.aisleOrder == null) return 1;
		if (b.aisleOrder == null) return -1;
		return a.aisleOrder - b.aisleOrder;
	})

	return (
		<Box w="100%">
			<Text 
				fontSize={{ base: "lg", md: "xl" }} 
				textTransform={"uppercase"} 
				fontWeight={"bold"} 
				textAlign={"center"} 
				mb={{ base: 4, md: 6 }}
				bgGradient='linear(to-l, #0b85f8, #00ffff)'
				bgClip='text'
			>
				Grocery List
			</Text>
			
			{isLoading && (
				<Flex justifyContent={"center"} my={{ base: 6, md: 8 }}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			
			{!isLoading && items?.length === 0 && (
				<Stack alignItems={"center"} spacing={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
					<Text 
						fontSize={{ base: "md", md: "lg" }} 
						textAlign={"center"} 
						color={"gray.500"}
						_dark={{ color: "gray.400" }}
					>
						All items completed! 🎉
					</Text>
				</Stack>
			)}
			
			<Stack spacing={{ base: 2, md: 3 }}>
				{items?.map((item) => (					
					<ListItem key={item.id} item={item} layoutId={layoutId} />
				))}
			</Stack>
		</Box>
	);
};
export default ItemList;