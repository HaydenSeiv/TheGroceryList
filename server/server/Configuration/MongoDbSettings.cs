namespace server.Configuration;

public class MongoDbSettings
{
    public required string DatabaseName { get; set; }
    public required string ItemsCollectionName { get; set; }
    public required string UsersCollectionName { get; set; }
    public required string ListsCollectionName { get; set; }
}

public class JwtSettings
{
    public required string SecretKey { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public int ExpiryHours { get; set; } = 24;
} 