using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class Item
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("_listId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string ListId { get; set; }

    [BsonElement("completed")]
    public bool Completed { get; set; } = false;

    [BsonElement("title")]
    public required string Title { get; set; }

    [BsonElement("category")]
    public string? Category { get; set; }

    [BsonElement("aisleOrder")]
    public int? AisleOrder { get; set; }
} 