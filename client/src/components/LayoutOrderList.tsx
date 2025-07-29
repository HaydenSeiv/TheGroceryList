import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BASE_URL } from "../main";
import LayoutItem from "./LayoutItem.tsx";


//the Layout struct, matches "Layout" design in both backend and database
export type Aisle = {
    aisleId: string;	
    layoutId: string;
    aisle: string;
    aisleOrder: number;
    layoutName: string;
};

const LayoutOrderList = ({ layoutId }: { layoutId: string | undefined }) => {

	//hook to get layouts from database in an array
    const {data:aisles, isLoading} = useQuery<Aisle[]>({
        queryKey:["layouts", layoutId],
		//function to get layouts from backend and in turn database
        queryFn: async () => {
            try {
                const res = await fetch(`${BASE_URL}/layouts/${layoutId}`, {          
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

	//sort the array of layouts based off of aisleOrder, this makes it so list is in proper order of aisles.

	aisles?.sort((a, b) => a.aisleOrder - b.aisleOrder)

	return (
		<>
			<Text fontSize={"xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}
            bgGradient='linear(to-l, #0b85f8, #00ffff)'
            bgClip='text'
            >
				Store Layout
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && aisles?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						Start making your layout! 🤞
					</Text>
					{/* <img src='/go.png' alt='Go logo' width={70} height={70} /> */}
				</Stack>
			)}
			<Stack gap={3}>
				{aisles?.map((aisle) => (
					<LayoutItem key={aisle.aisleId} aisle={aisle} />
				))}
			</Stack>
		</>
	);
};
export default LayoutOrderList;