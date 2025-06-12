package api

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/HaydenSeiv/TheGroceryList/models"
)

func GetLists(c *fiber.Ctx) error {
	var lists []models.List

	//Get current user
	//assign signed in userID
	user, err := GetAuthenticatedUser(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Find all lists that belong to this user
	filter := bson.M{"_userId": user.UserId}
	//filter := bson.M{}

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := models.ListCollection.Find(context.Background(), filter)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch lists",
		})
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once we have the items we will close off the cursor (pointer)
	defer cursor.Close(context.Background())

	// Use the already declared lists slice
	if err := cursor.All(context.Background(), &lists); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not decode lists",
		})
	}

	return c.JSON(lists)
}
func CreateList(c *fiber.Ctx) error {
	list := new(models.List)

	if err := c.BodyParser(list); err != nil {
		return err
	}

	//error handle a blank List Name
	if list.ListName == "" {
		return c.Status(400).JSON(fiber.Map{"error": "List name cannot be empty"})
	}

	list.DateCreated = time.Now()

	//assign signed in userID
	user, err := GetAuthenticatedUser(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	fmt.Println(user.UserId)

	list.UserId = user.UserId

	fmt.Println(list.UserId)

	//insert our list into our database collection
	insertResult, err := models.ListCollection.InsertOne(context.Background(), list)
	if err != nil {
		return err
	}

	//assign ID to the one created by database
	list.ListId = insertResult.InsertedID.(primitive.ObjectID)

	//return success status if no errors triggered
	return c.Status(201).JSON(list)
}
func DeleteList(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	listId := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(listId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"Error": "Invalid list ID"})
	}

	//filter based off of ID and delete matching item -- "_" variable used as we do not use the returned value
	filter := bson.M{"_id": objectID}
	_, err = models.ListCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
