package api

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/HaydenSeiv/TheGroceryList/models"
	"github.com/HaydenSeiv/TheGroceryList/pkg"
)

const SecretKey = "secret"

func CreateUser(c *fiber.Ctx) error {
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

	if hashedPassword, passwordErr := pkg.HashPassword(user.Password); passwordErr != nil {
		return passwordErr
	} else {
		user.Password = hashedPassword
	}

	//convert email to lower case before saving
	user.Email = strings.ToLower(user.Email)

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

func LoginUser(c *fiber.Ctx) error {
	// Validate user input (username/email, password)
	// Retrieve user data from the database based on input
	// Compare hashed password with input password
	// Generate a session or token for authentication
	// Return a success message or error response

	userEmail := c.Params("email")
	userPassword := c.Params("password")

	//var data map[string]string = make(map[string]string)

	// err := c.BodyParser(&data)
	// if err != nil {
	// 	return c.Status(400).JSON(fiber.Map{
	// 		"success": false,
	// 		"message": "Invalid post request",
	// 	})
	// }

	//check if user entered password
	if userEmail == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Password is required",
			"error":   map[string]interface{}{},
		})
	}
	//check if user entered email
	if userPassword == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "email is required",
			"error":   map[string]interface{}{},
		})
	}

	//change inputed email to lowercase
	userEmail = strings.ToLower(userEmail)

	filter := bson.M{"email": userEmail}
	var user models.User
	userFound := models.UserCollection.FindOne(context.TODO(), filter).Decode(&user)

	if userFound != nil {
		if userFound == mongo.ErrNoDocuments {
			// User not found, direct to sign up
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"message": "Email not found, please create account",
				"error":   map[string]interface{}{},
			})
		} else {
			// Some other error occurred
			return c.Status(fiber.StatusInternalServerError).SendString("Error checking email")
		}
	}

	if !pkg.CheckPasswordHash(userPassword, user.Password) {
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "Incorrect password",
			"error":   map[string]interface{}{},
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.RegisteredClaims{
		Issuer:    user.UserId.Hex(),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), //token lasts for 24 hours
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "could not login"})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Login success",
	})
}

func ValidateUserAuth(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	}, jwt.WithLeeway(5*time.Second))

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "unauthenticated"})
	}

	claims := token.Claims.(*jwt.RegisteredClaims)

	userID, err := primitive.ObjectIDFromHex(claims.Issuer)
	if err != nil {
		fmt.Printf("invalid ObjectID: %v", err)
	}

	var user models.User
	filter := bson.M{"_id": userID}

	userFound := models.UserCollection.FindOne(context.TODO(), filter).Decode(&user)

	if userFound != nil {
		if userFound == mongo.ErrNoDocuments {
			// User not found
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"message": "User not found",
				"error":   map[string]interface{}{},
			})
		} else {
			// Some other error occurred
			return c.Status(fiber.StatusInternalServerError).SendString("Error checking email")
		}
	}

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	//set cookie to be expired
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
