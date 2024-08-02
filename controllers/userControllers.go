package controllers

import (
	"context"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"github.com/HaydenSeiv/TheGroceryList/models"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CreateUser(c *fiber.Ctx) error {
	fmt.Println("We here")
	user := new(models.User)

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
	var existingUser models.User
	emailFound := models.UserCollection.FindOne(context.TODO(), filter).Decode(&existingUser)

	if emailFound != nil {
		if emailFound == mongo.ErrNoDocuments {
			// Email not found, proceed with sign up process
			//insert our item into our database collection
			insertResult, err := models.UserCollection.InsertOne(context.Background(), user)
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
func GetUsers(c *fiber.Ctx) error {
	var users []models.User

	//finding items in db collection, "bson.M{}" is left blank as that is a search filter, we dont want filter we want to find all
	//"cursor" is assigned as a cursor is returned when you make a query in MongoDB. it works like a pointer
	cursor, err := models.UserCollection.Find(context.Background(), bson.M{})

	if err != nil {
		log.Fatal(err)
	}

	//defer postspones the excution of this code until the surronding function is complete
	//in this case once we have the items we will close off the cursor (pointer)
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user models.User

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
func DeleteUser(c *fiber.Ctx) error {
	//get the item id -- id is a json string, so we turn it into a type of "primitive" so mongoDB can use
	userId := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"Error": "Invalid user ID"})
	}

	//filter based off of ID and delete matching item -- "_" variable used as we do not use the returned value
	filter := bson.M{"_id": objectID}
	_, err = models.UserCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	//if no errors return a status of success
	return c.Status(200).JSON(fiber.Map{"Success": true})
}
