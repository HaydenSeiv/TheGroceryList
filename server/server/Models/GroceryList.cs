using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class GroceryList
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("_userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; }

    [BsonElement("listName")]
    public required string ListName { get; set; }

    [BsonElement("_dateCreated")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
} 