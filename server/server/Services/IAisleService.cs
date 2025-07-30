using server.DTOs;
namespace server.Services;

public interface IAisleService
{
    Task<IEnumerable<AisleResponseDto>> GetAislesAsync(string layoutId, string userId);
    Task<AisleResponseDto?> CreateAisleAsync(CreateAisleDto createAisleDto, string userId);
    Task<bool> DeleteAisleAsync(string aisleId, string userId);
}

