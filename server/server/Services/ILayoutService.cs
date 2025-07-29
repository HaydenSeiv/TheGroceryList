using server.DTOs;

namespace server.Services;

public interface ILayoutService
{
    Task<IEnumerable<LayoutResponseDto>> GetUserLayoutsAsync(string userId);
    Task<LayoutResponseDto?> CreateLayoutAsync(string userId, CreateLayoutDto createLayoutDto);
    Task<bool> DeleteLayoutAsync(string layoutId, string userId);
} 