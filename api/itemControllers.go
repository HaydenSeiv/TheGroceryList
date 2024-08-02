package api

import (
	"context"
	"log"
	"net/url"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/HaydenSeiv/TheGroceryList/models"
)

func GetItems(c *fiber.Ctx) error {
	var items []models.Item

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := models.ItemCollection.Find(context.Background(), bson.M{})

	if err != nil {
		log.Fatal(err)
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once we have the items we will close off the cursor (pointer)
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var item models.Item

		//Decode takes the JSON and turns it into a Go struct (unmarshal), if any errors such as null (nil) it will return err
		if err := cursor.Decode(&item); err != nil {
			return err
		}

		//if no errors, add item to the items array
		items = append(items, item)
	}

	//return the array
	return c.JSON(items)
}

func CreateItem(c *fiber.Ctx) error {
	item := new(models.Item)

	if err := c.BodyParser(item); err != nil {
		return err
	}

	//error handle a blank title
	if item.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Item title/name cannot be empty"})
	}

	//insert our item into our database collection
	insertResult, err := models.ItemCollection.InsertOne(context.Background(), item)
	if err != nil {
		return err
	}

	//assign ID to the one created by database
	item.ID = insertResult.InsertedID.(primitive.ObjectID)

	//return success status if no errors triggered
	return c.Status(201).JSON(item)
}

func CompleteItem(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid item ID"})
	}

	//filter items based off of ID
	filter := bson.M{"_id": objectID}

	//update item status to complete
	update := []any{
		bson.M{"$set": bson.M{"completed": bson.M{"$not": "$completed"}}}}

	//push change to the database collection based off the filter and status update
	_, err = models.ItemCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	//if no errors return status of success
	return c.Status(200).JSON(fiber.Map{"success": true})
}
func UpdateItem(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	id := c.Params("id")
	newTitle := c.Params("newTitle")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid item ID"})
	}

	//because newTitle string data come encoded in URL with special chars we have to decode back into a readable string (for example if there was a space in the string it would be sent with "%20" instead of space)
	decodedTitle, err2 := url.QueryUnescape(newTitle)
	if err2 != nil {
		log.Fatal(err2)
	}

	//filter items based off of ID
	filter := bson.M{"_id": objectID}

	//update item name
	update := bson.M{"$set": bson.M{"title": decodedTitle}}

	//push change to the database collection based off the filter and title update
	_, err = models.ItemCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	//if no errors return status of success
	return c.Status(200).JSON(fiber.Map{"success": true})
}
func DeleteItem(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"Error": "Invalid item ID"})
	}

	//filter based off of ID and delete matching item -- "_" variable used as we do not use the returned value
	filter := bson.M{"_id": objectID}
	_, err = models.ItemCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
