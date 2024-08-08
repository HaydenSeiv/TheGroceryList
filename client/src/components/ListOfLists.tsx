import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BASE_URL } from "../main";

//the Item struct, matches "Item" design in both backend and database
export type List = {
    _id: number;
    userID: number;
    listName: string;
    dateCreated: string;
};

const ListOfLists = () => {

	//hook to get items from database in an array
    const {data:lists, isLoading} = useQuery<List[]>({
        queryKey:["lists"],

		//function to get items from backend and in turn database
        queryFn: async () => {
            try {
                const res = await fetch(BASE_URL + "/lists")
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

	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}
            bgGradient='linear(to-l, #0b85f8, #00ffff)'
            bgClip='text'
            >
				Grocery Lists
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && lists?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All items completed! 🤞
					</Text>
					{/* <img src='/go.png' alt='Go logo' width={70} height={70} /> */}
				</Stack>
			)}
			<Stack gap={3}>
				{/* {lists?.map((list) => (                    
					<ListItem key={list._id} list={list} />
				))} */}
			</Stack>
		</>
	);
};
export default ListOfLists;