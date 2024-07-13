package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

// our grocery item struct
type Item struct {
	ID        int    `json:"id"`        // the unique id of the item
	Completed bool   `json:"completed"` //if the item as been picked up or not
	Title     string `json:"title"`     //the title or name of the item
	Category  string `json:"category"`  //the category or "aisle"
	CatID     int    `json:"CatID"`     //the id of that category -- Produce would be 1 etc
}

// main api function
func main() {
	fmt.Println("Hello worlds") //just testing

	//creating our new app instance in fiber -- fiber is out web framework for Golang
	app := fiber.New()

	//load our .env file with envirment variables, if there is an error kill program
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//Get the PORT enviroment variable from .env (our manually assigned port)
	PORT := os.Getenv("PORT")

	//items is our array ofr Item structs
	items := []Item{}

	//the get call,  --c is a pointer to our fiber context
	app.Get("/api/items", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(items)
	})

	//the Post call to create a new item
	app.Post("/api/items", func(c *fiber.Ctx) error {

		//item is a pointer to the struct Item
		item := &Item{}

		//if there is no info in the struct, return an error
		if err := c.BodyParser(item); err != nil {
			return err
		}

		//if the item does not have a title, return an error
		if item.Title == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Item title is required"})
		}

		//right now this assigns an ID the increments by one
		item.ID = len(items) + 1

		//add the newly created item to our array of Item structs
		items = append(items, *item)

		//if everything went through, return 201 and the json of the item
		return c.Status(201).JSON(item)
	})

	//updating a todo if completed (could use a PUT but using PATCH right now), :id will be the ID of the item we are trying to update
	app.Patch("/api/items/:id", func(c *fiber.Ctx) error {

		//set id to be the "id" of our selected item --it is a string
		id := c.Params("id")

		//a GO for loop, for index of i, loop through items in the range of the array of items
		for i, item := range items {

			//because ID is int and id is string, we need to convert ID to string using Sprint
			if fmt.Sprint(item.ID) == id {

				//set item to be completed
				items[i].Completed = true
				return c.Status(200).JSON(items[i])

			}
		}

		//if we get here, no item was found, return error
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	})

	//Delete an item
	app.Delete("/api/items/:id", func(c *fiber.Ctx) error {
		//set id to be the "id" of our selected item --it is a string
		id := c.Params("id")

		//a GO for loop, for index of i, loop through items in the range of the array of items
		for i, item := range items {

			//because ID is int and id is string, we need to convert ID to string using Sprint
			if fmt.Sprint(item.ID) == id {

				//the array of items now becomes all of the items up until i and all the ones after i. thus removing the item at i
				items = append(items[:i], items[i+1:]...)
				return c.Status(200).JSON(fiber.Map{"Success": true})
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	})

	log.Fatal(app.Listen(":" + PORT))
}
