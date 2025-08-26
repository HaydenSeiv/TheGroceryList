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
        
        var itemResponses = new List<ItemResponseDto>();

        //collect aisle IDs from items
        var aisleIds = items.Where(i => !string.IsNullOrEmpty(i.AisleId))
                   .Select(i => i.AisleId!)
                   .Distinct()
                   .ToList();

        //batch aisles
        var aisles = aisleIds.Any() 
        ? await _context.Aisles.Find(a => aisleIds.Contains(a.AisleId)).ToListAsync()
        : new List<Aisle>();


        //create a dictionary to map aisle IDs to aisle orders
        var aisleMap = aisles.ToDictionary(a => a.AisleId!, a => a);
        
        //using dictionary aisle map, get name and order and return them in the item response
        foreach (var item in items)
        {
            var aisleId = item.AisleId;
            var aisle = aisleId != null ? aisleMap[aisleId] : null;

            itemResponses.Add(new ItemResponseDto
            {
                Id = item.Id ?? string.Empty,
                ListId = item.ListId,
                Completed = item.Completed,
                Title = item.Title,
                AisleId = item.AisleId,

                AisleName = aisle?.AisleName ?? string.Empty,
                AisleOrder = aisle?.AisleOrder
            });
        }
        return itemResponses;
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

        // If aisleId is provided, verify it exists and belongs to user's layout
        Aisle? aisle = null;
        if (!string.IsNullOrWhiteSpace(createItemDto.AisleId))
        {
            aisle = await _context.Aisles.Find(a => a.AisleId == createItemDto.AisleId).FirstOrDefaultAsync();
            if (aisle == null)
                throw new ArgumentException("Aisle not found");
                
            // Verify the aisle belongs to a layout owned by the user
            var layout = await _context.Layouts.Find(l => l.LayoutId == aisle.LayoutId && l.UserId == userId).FirstOrDefaultAsync();
            if (layout == null)
                throw new UnauthorizedAccessException("Aisle access denied");
        }

        var item = new Item
        {
            ListId = createItemDto.ListId,
            Title = createItemDto.Title,
            AisleId = createItemDto.AisleId,
            Completed = false
        };

        await _context.Items.InsertOneAsync(item);

        return new ItemResponseDto
        {
            Id = item.Id ?? string.Empty,
            ListId = item.ListId,
            Completed = item.Completed,
            Title = item.Title,
            AisleId = item.AisleId,
            AisleName = aisle?.AisleName ?? string.Empty,
            AisleOrder = aisle?.AisleOrder
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
        // URL decode the title 
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