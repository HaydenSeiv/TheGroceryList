using MongoDB.Driver;
using server.Configuration;
using server.Models;
using Microsoft.Extensions.Options;

namespace server.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    private readonly MongoDbSettings _settings;

    public MongoDbContext(IOptions<MongoDbSettings> settings, IMongoClient mongoClient)
    {
        _settings = settings.Value;
        _database = mongoClient.GetDatabase(_settings.DatabaseName);
    }

    public IMongoCollection<User> Users => 
        _database.GetCollection<User>(_settings.UsersCollectionName);

    public IMongoCollection<GroceryList> Lists => 
        _database.GetCollection<GroceryList>(_settings.ListsCollectionName);

    public IMongoCollection<Item> Items => 
        _database.GetCollection<Item>(_settings.ItemsCollectionName);

    public IMongoCollection<Layout> Layouts => 
        _database.GetCollection<Layout>(_settings.LayoutsCollectionName);
} 