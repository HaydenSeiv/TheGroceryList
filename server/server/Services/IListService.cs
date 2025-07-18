using server.DTOs;

namespace server.Services;

public interface IListService
{
    Task<IEnumerable<ListResponseDto>> GetUserListsAsync(string userId);
    Task<ListResponseDto?> CreateListAsync(string userId, CreateListDto createListDto);
    Task<bool> DeleteListAsync(string listId, string userId);
} 