package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// our grocery item struct
type Item struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"` // the unique id of the item created by DB - mongoDB uses bson - Primitive is a MongoDB type --omitempty is important as it omits 000000 id that may be sent first with no item being created
	Completed bool               `json:"completed"`                         //if the item as been picked up or not
	Title     string             `json:"title"`                             //the title or name of the item
	Category  string             `json:"category"`                          //the category or "aisle"
	CatID     int                `json:"CatID"`                             //the id of that category -- Produce would be 1 etc
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello World")

	//load our .env file with envirment variables, if there is an error kill program
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	//get the MongoDB URI from from the enviro vars and connect to the database
	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once there are no more handlers to be called, we wil diconnect from the database
	defer client.Disconnect(context.Background())

	//if cant ping, return error
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	//if connected to DB
	fmt.Println("Connected to MONGODB ATLAS")

	//get the collection from mongoDB
	collection = client.Database("golang_db").Collection("items")

	//creating our new app instance in fiber -- fiber is out web framework for Golang
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content - Type, Accept",
	}))

	//assign the handlers to their respective functions
	app.Get("/api/items", getItems)
	app.Post("/api/items", createItem)
	app.Patch("/api/items/:id", updateItem)
	app.Delete("/api/items/:id", deleteItem)

	//get the port from our enviro vars
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

// the GET function
func getItems(c *fiber.Ctx) error {
	var items []Item

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		log.Fatal(err)
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once we have the items we will close off the cursor (pointer)
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var item Item

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

func createItem(c *fiber.Ctx) error {
	item := new(Item)

	if err := c.BodyParser(item); err != nil {
		return err
	}

	//error handle a blank title
	if item.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Item title/name cannot be empty"})
	}

	//insert our item into our database collection
	insertResult, err := collection.InsertOne(context.Background(), item)
	if err != nil {
		return err
	}

	//assign ID to the one created by database
	item.ID = insertResult.InsertedID.(primitive.ObjectID)

	//return success status if no errors triggered
	return c.Status(201).JSON(item)
}

func updateItem(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid item ID"})
	}

	//filter items based off of ID
	filter := bson.M{"_id": objectID}

	//update item status to completed
	update := bson.M{"$set": bson.M{"completed": true}}

	//push change to the database collection based off the filter and status update
	_, err = collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	//if no errors return status of success
	return c.Status(200).JSON(fiber.Map{"success": true})
}
func deleteItem(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"Error": "Invalid item ID"})
	}

	//filter based off of ID and delete matching item -- "_" variable used as we do not use the returned value
	filter := bson.M{"_id": objectID}
	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
