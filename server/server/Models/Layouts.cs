using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class Layout
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? LayoutId { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; }

    [BsonElement("layoutName")]
    public required string LayoutName { get; set; }
} 