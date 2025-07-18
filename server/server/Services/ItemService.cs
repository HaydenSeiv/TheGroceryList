using MongoDB.Driver;
using server.Data;
using server.DTOs;
using server.Models;
using System.Web;

namespace server.Services;

public class ItemService : IItemService
{
    private readonly MongoDbContext _context;

    public ItemService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ItemResponseDto>> GetItemsAsync(string listId, string userId)
    {
        // First verify the list belongs to the user
        var list = await _context.Lists.Find(l => l.Id == listId && l.UserId == userId).FirstOrDefaultAsync();
        if (list == null)
            throw new UnauthorizedAccessException("List not found or access denied");

        var items = await _context.Items.Find(i => i.ListId == listId).ToListAsync();
        return items.Select(i => new ItemResponseDto
        {
            Id = i.Id ?? string.Empty,
            ListId = i.ListId,
            Completed = i.Completed,
            Title = i.Title,
            Category = i.Category,
            CatID = i.CatID
        });
    }

    public async Task<ItemResponseDto?> CreateItemAsync(CreateItemDto createItemDto, string userId)
    {
        if (string.IsNullOrWhiteSpace(createItemDto.Title))
            throw new ArgumentException("Item title/name cannot be empty");

        if (string.IsNullOrWhiteSpace(createItemDto.ListId))
            throw new ArgumentException("List ID cannot be empty");

        // Verify the list belongs to the user
        var list = await _context.Lists.Find(l => l.Id == createItemDto.ListId && l.UserId == userId).FirstOrDefaultAsync();
        if (list == null)
            throw new UnauthorizedAccessException("List not found or access denied");

        var item = new Item
        {
            ListId = createItemDto.ListId,
            Title = createItemDto.Title,
            Category = createItemDto.Category,
            CatID = createItemDto.CatID,
            Completed = false
        };

        await _context.Items.InsertOneAsync(item);

        return new ItemResponseDto
        {
            Id = item.Id ?? string.Empty,
            ListId = item.ListId,
            Completed = item.Completed,
            Title = item.Title,
            Category = item.Category,
            CatID = item.CatID
        };
    }

    public async Task<bool> CompleteItemAsync(string itemId, string userId)
    {
        // Verify the item belongs to a list owned by the user
        var item = await _context.Items.Find(i => i.Id == itemId).FirstOrDefaultAsync();
        if (item == null) return false;

        var list = await _context.Lists.Find(l => l.Id == item.ListId && l.UserId == userId).FirstOrDefaultAsync();
        if (list == null) return false;

        // Toggle completion status
        var update = Builders<Item>.Update.Set(i => i.Completed, !item.Completed);
        var result = await _context.Items.UpdateOneAsync(i => i.Id == itemId, update);
        
        return result.ModifiedCount > 0;
    }

    public async Task<bool> UpdateItemAsync(string itemId, string newTitle, string userId)
    {
        // URL decode the title (equivalent to Go's url.QueryUnescape)
        var decodedTitle = HttpUtility.UrlDecode(newTitle);
        
        // Verify the item belongs to a list owned by the user
        var item = await _context.Items.Find(i => i.Id == itemId).FirstOrDefaultAsync();
        if (item == null) return false;

        var list = await _context.Lists.Find(l => l.Id == item.ListId && l.UserId == userId).FirstOrDefaultAsync();
        if (list == null) return false;

        var update = Builders<Item>.Update.Set(i => i.Title, decodedTitle);
        var result = await _context.Items.UpdateOneAsync(i => i.Id == itemId, update);
        
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteItemAsync(string itemId, string userId)
    {
        // Verify the item belongs to a list owned by the user
        var item = await _context.Items.Find(i => i.Id == itemId).FirstOrDefaultAsync();
        if (item == null) return false;

        var list = await _context.Lists.Find(l => l.Id == item.ListId && l.UserId == userId).FirstOrDefaultAsync();
        if (list == null) return false;

        var result = await _context.Items.DeleteOneAsync(i => i.Id == itemId);
        return result.DeletedCount > 0;
    }
} 