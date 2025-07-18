using server.DTOs;

namespace server.Services;

public interface IItemService
{
    Task<IEnumerable<ItemResponseDto>> GetItemsAsync(string listId, string userId);
    Task<ItemResponseDto?> CreateItemAsync(CreateItemDto createItemDto, string userId);
    Task<bool> CompleteItemAsync(string itemId, string userId);
    Task<bool> UpdateItemAsync(string itemId, string newTitle, string userId);
    Task<bool> DeleteItemAsync(string itemId, string userId);
} 