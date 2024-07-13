package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// our grocery item struct
type Item struct {
	ID        int    `json:"id" bson:"_id"` // the unique id of the item - bson is the MongoDB id
	Completed bool   `json:"completed"`     //if the item as been picked up or not
	Title     string `json:"title"`         //the title or name of the item
	Category  string `json:"category"`      //the category or "aisle"
	CatID     int    `json:"CatID"`         //the id of that category -- Produce would be 1 etc
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello world")

	//load our .env file with envirment variables, if there is an error kill program
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	//get the MongoDB URI from from the enviro vars and connect to the database
	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background())

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MONGODB ATLAS")
}
