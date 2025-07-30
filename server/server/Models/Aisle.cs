using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class Aisle
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? AisleId { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; }

    [BsonElement("layoutId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string LayoutId { get; set; }

    [BsonElement("aisleName")]
    public required string AisleName { get; set; }

    [BsonElement("aisleOrder")]
    public int? AisleOrder { get; set; }
}

