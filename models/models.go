package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
	UserId       primitive.ObjectID `json:"userId,omitempty" bson:"_id,omitempty"` //unique user ID referencing which user this list belongs too
	FirstName    string             `json:"firstName"`
	LastName     string             `json:"lastName"`
	Email        string             `json:"email"`
	Password     string             `json:"password"`
	CurrentToken string             `json: "currentToken"`
}

var ItemCollection *mongo.Collection
var ListCollection *mongo.Collection
var UserCollection *mongo.Collection
