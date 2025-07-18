using MongoDB.Driver;
using server.Data;
using server.DTOs;
using server.Models;

namespace server.Services;

public class ListService : IListService
{
    private readonly MongoDbContext _context;

    public ListService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ListResponseDto>> GetUserListsAsync(string userId)
    {
        var lists = await _context.Lists.Find(l => l.UserId == userId).ToListAsync();
        return lists.Select(l => new ListResponseDto
        {
            Id = l.Id ?? string.Empty,
            UserId = l.UserId,
            ListName = l.ListName,
            DateCreated = l.DateCreated
        });
    }

    public async Task<ListResponseDto?> CreateListAsync(string userId, CreateListDto createListDto)
    {
        if (string.IsNullOrWhiteSpace(createListDto.ListName))
            throw new ArgumentException("List name cannot be empty");

        var groceryList = new GroceryList
        {
            UserId = userId,
            ListName = createListDto.ListName,
            DateCreated = DateTime.UtcNow
        };

        await _context.Lists.InsertOneAsync(groceryList);

        return new ListResponseDto
        {
            Id = groceryList.Id ?? string.Empty,
            UserId = groceryList.UserId,
            ListName = groceryList.ListName,
            DateCreated = groceryList.DateCreated
        };
    }

    public async Task<bool> DeleteListAsync(string listId, string userId)
    {
        // Ensure the list belongs to the user before deleting
        var result = await _context.Lists.DeleteOneAsync(l => l.Id == listId && l.UserId == userId);
        return result.DeletedCount > 0;
    }
} 