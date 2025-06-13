package main

//testing testing branch
import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/HaydenSeiv/TheGroceryList/api"
	"github.com/HaydenSeiv/TheGroceryList/api/middleware"
	"github.com/HaydenSeiv/TheGroceryList/models"
)

func main() {
	fmt.Println("Hello, The Grocery List")

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
	models.ItemCollection = client.Database("golang_db").Collection("items")
	models.UserCollection = client.Database("golang_db").Collection("users")
	models.ListCollection = client.Database("golang_db").Collection("lists")

	//creating our new app instance in fiber -- fiber is our web framework for Golang
	app := fiber.New()

	//work around cors for dev on local machine
	if os.Getenv("ENV") != "production" {
		app.Use(cors.New(cors.Config{
			AllowOrigins:     "http://localhost:5173,http://localhost:5174",
			AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
			AllowCredentials: true,
		}))
	}

	//assign the item handlers to their respective functions
	app.Get("/api/items/:listId", api.GetItems)
	app.Post("/api/items", api.CreateItem)
	app.Patch("/api/items/:id", api.CompleteItem)
	app.Patch("/api/itemsupdate/:id/:newTitle", api.UpdateItem)
	app.Delete("/api/items/:id", api.DeleteItem)

	//assign the user handlers
	app.Get("/api/users", api.GetUsers)
	app.Post("/api/users", api.CreateUser)
	app.Delete("/api/users/:id", api.DeleteUser)
	app.Post("/api/login", api.LoginUser)
	app.Get("/api/login/userauth", api.ValidateUserAuth)
	app.Post("/api/logout", api.Logout)

	//assign the list handlers
	app.Get("/api/lists", middleware.AuthRequired(), api.GetLists)
	app.Post("/api/lists", middleware.AuthRequired(), api.CreateList)
	app.Delete("/api/lists/:id", middleware.AuthRequired(), api.DeleteList)

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
