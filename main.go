package main

//testing testing branch
import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// our grocery item struct
type Item struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`         // the unique id of the item created by DB - mongoDB uses bson - Primitive is a MongoDB type --omitempty is important as it omits 000000 id that may be sent first with no item being created
	ListId    primitive.ObjectID `json:"listId,omitempty" bson:"_listId,omitempty"` //unique list ID referencing which list this item is apart of
	Completed bool               `json:"completed"`                                 //if the item as been picked up or not
	Title     string             `json:"title"`                                     //the title or name of the item
	Category  string             `json:"category"`                                  //the category or "aisle"
	CatID     int                `json:"catID"`                                     //the id of that category -- Produce would be 1 etc
}

// the list struct for every list a user creates
type List struct {
	ListId      primitive.ObjectID `json:"listId,omitempty" bson:"_id,omitempty"`     //unique list ID for tracking lists
	UserId      primitive.ObjectID `json:"userId,omitempty" bson:"_userId,omitempty"` //unique user ID referencing which user this list belongs too
	ListName    string             `json:"listName"`
	DateCreated time.Time          `json:"dateCreated" bson:"_dateCreated"` //date that the list was created
}

// the users struct to hold user data
type User struct {
	UserId    primitive.ObjectID `json:"userId,omitempty" bson:"_id,omitempty"` //unique user ID referencing which user this list belongs too
	FirstName string             `json:"firstName"`
	LastName  string             `json:"lastName"`
	Email     string             `json:"email"`
	Password  string             `json:"password"`
}

var itemCollection *mongo.Collection
var listCollection *mongo.Collection
var userCollection *mongo.Collection

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func main() {
	fmt.Println("Hello World")

	//if not in production - load our .env file with envirment variables, if there is an error kill program
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load(".env")

		if err != nil {
			log.Fatal("Error loading .env file", err)
		}
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

	//get the collections from mongoDB
	itemCollection = client.Database("golang_db").Collection("items")
	userCollection = client.Database("golang_db").Collection("users")
	listCollection = client.Database("golang_db").Collection("lists")

	//creating our new app instance in fiber -- fiber is our web framework for Golang
	app := fiber.New()

	//work around cors for dev on local machine
	if os.Getenv("ENV") != "production" {
		app.Use(cors.New(cors.Config{
			AllowOrigins: "http://localhost:5173",
			AllowHeaders: "Origin, Content - Type, Accept",
		}))
	}

	//assign the item handlers to their respective functions
	app.Get("/api/items", getItems)
	app.Post("/api/items", createItem)
	app.Patch("/api/items/:id", completeItem)
	app.Patch("/api/itemsupdate/:id/:newTitle", updateItem)
	app.Delete("/api/items/:id", deleteItem)

	//assign the user handlers
	app.Get("/api/users", getUsers)
	app.Post("/api/users", createUser)
	app.Delete("/api/users/:id", deleteUser)

	//assign the list handlers
	app.Get("/api/lists", getLists)
	app.Post("/api/lists", createList)
	app.Delete("/api/lists/:id", deleteList)

	//get the port from our enviro vars
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	//if app is in prodution, if any request outside of the set handlers above get triggered, it routes to client/dist
	if os.Getenv("ENV") == "production" {
		app.Static("/", "./client/dist")
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

// the GET function
func getItems(c *fiber.Ctx) error {
	var items []Item

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := itemCollection.Find(context.Background(), bson.M{})

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
	insertResult, err := itemCollection.InsertOne(context.Background(), item)
	if err != nil {
		return err
	}

	//assign ID to the one created by database
	item.ID = insertResult.InsertedID.(primitive.ObjectID)

	//return success status if no errors triggered
	return c.Status(201).JSON(item)
}

func completeItem(c *fiber.Ctx) error {
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
	_, err = itemCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	//if no errors return status of success
	return c.Status(200).JSON(fiber.Map{"success": true})
}
func updateItem(c *fiber.Ctx) error {
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
	_, err = itemCollection.UpdateOne(context.Background(), filter, update)

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
	_, err = itemCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
func createUser(c *fiber.Ctx) error {
	fmt.Println("We here")
	user := new(User)

	if err := c.BodyParser(user); err != nil {
		return err
	}

	//error handle a blank First Name
	if user.FirstName == "" {
		return c.Status(400).JSON(fiber.Map{"error": "First name cannot be empty"})
	}
	//error handle a blank Last name
	if user.LastName == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Last name cannot be empty"})
	}
	//error handle a blank email
	if user.Email == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Email cannot be empty"})
	}
	//error handle a blank password
	if user.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Password cannot be empty"})
	}

	if hashedPassword, passwordErr := HashPassword(user.Password); passwordErr != nil {
		return passwordErr
	} else {
		user.Password = string(hashedPassword)
	}

	//if email already exists throw error
	filter := bson.M{"email": user.Email}
	var existingUser User
	emailFound := userCollection.FindOne(context.TODO(), filter).Decode(&existingUser)

	if emailFound != nil {
		if emailFound == mongo.ErrNoDocuments {
			//// Email not found, proceed with sign up process
			//insert our item into our database collection
			insertResult, err := userCollection.InsertOne(context.Background(), user)
			if err != nil {
				return err
			}

			//assign ID to the one created by database
			user.UserId = insertResult.InsertedID.(primitive.ObjectID)

			//return success status if no errors triggered
			return c.Status(201).JSON(user)

		} else {
			// Some other error occurred
			return c.Status(fiber.StatusInternalServerError).SendString("Error checking email")
		}
	}

	// If we reach here, email already exists
	return c.Status(fiber.StatusConflict).SendString("Email already in use")

}
func getUsers(c *fiber.Ctx) error {
	var users []User

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := userCollection.Find(context.Background(), bson.M{})

	if err != nil {
		log.Fatal(err)
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once we have the items we will close off the cursor (pointer)
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user User

		//Decode takes the JSON and turns it into a Go struct (unmarshal), if any errors such as null (nil) it will return err
		if err := cursor.Decode(&user); err != nil {
			return err
		}

		//if no errors, add item to the items array
		users = append(users, user)
	}

	//return the array
	return c.JSON(users)
}
func deleteUser(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	userId := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"Error": "Invalid user ID"})
	}

	//filter based off of ID and delete matching item -- "_" variable used as we do not use the returned value
	filter := bson.M{"_id": objectID}
	_, err = userCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
func getLists(c *fiber.Ctx) error {
	var lists []List

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := listCollection.Find(context.Background(), bson.M{})

	if err != nil {
		log.Fatal(err)
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once we have the items we will close off the cursor (pointer)
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var list List

		//Decode takes the JSON and turns it into a Go struct (unmarshal), if any errors such as null (nil) it will return err
		if err := cursor.Decode(&list); err != nil {
			return err
		}

		//if no errors, add item to the items array
		lists = append(lists, list)
	}

	//return the array
	return c.JSON(lists)
}
func createList(c *fiber.Ctx) error {
	list := new(List)

	if err := c.BodyParser(list); err != nil {
		return err
	}

	//error handle a blank List Name
	if list.ListName == "" {
		return c.Status(400).JSON(fiber.Map{"error": "List name cannot be empty"})
	}

	list.DateCreated = time.Now()

	//insert our list into our database collection
	insertResult, err := listCollection.InsertOne(context.Background(), list)
	if err != nil {
		return err
	}

	//assign ID to the one created by database
	list.ListId = insertResult.InsertedID.(primitive.ObjectID)

	//return success status if no errors triggered
	return c.Status(201).JSON(list)
}
func deleteList(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	listId := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(listId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"Error": "Invalid list ID"})
	}

	//filter based off of ID and delete matching item -- "_" variable used as we do not use the returned value
	filter := bson.M{"_id": objectID}
	_, err = listCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
