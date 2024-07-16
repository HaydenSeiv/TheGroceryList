import { Button, Flex, Input, Spinner, Select } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../App";
import React from "react";

const ItemForm = () => {
	const [newItem, setNewItem] = useState("");
	
	const queryClient = useQueryClient();

	const {mutate:createItem, isPending:isCreating} = useMutation({
		mutationKey:['createItem'],
		mutationFn:async(e:React.FormEvent)=>{
			e.preventDefault()
			try {
				const res = await fetch(BASE_URL + '/items', {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ title: newItem}),

				})
				const data = await res.json();

				if (!res.ok){
					throw new Error(data.error || "Something went wrong")
				}

				setNewItem("");
				return data
				
			} catch (error:any) {
				throw new Error(error)				
			}
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},

		onError: (error:any) => {
			alert(error.message);
		}

	})


	return (
		<form onSubmit={createItem}>
			<Flex gap={2}>
				<Input
					type='text'
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
					ref={(input) => input && input.focus()}
				/>
				<Button
					mx={2}
					type='submit'
					_active={{
						transform: "scale(.97)",
					}}
				>
					{isCreating? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};
export default ItemForm;