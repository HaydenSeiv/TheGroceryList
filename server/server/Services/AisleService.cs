using MongoDB.Driver;
using server.Data;
using server.DTOs;
using server.Models;

namespace server.Services;

public class AisleService : IAisleService
{
    private readonly MongoDbContext _context;

    public AisleService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AisleResponseDto>> GetAislesAsync(string layoutId, string userId)
    {
        // First verify the layout belongs to the user
        var layout = await _context.Layouts.Find(l => l.LayoutId == layoutId && l.UserId == userId).FirstOrDefaultAsync();
        if (layout == null)
            throw new UnauthorizedAccessException("Layout not found or access denied");

        var aisles = await _context.Aisles.Find(a => a.LayoutId == layoutId).ToListAsync();
        
        return aisles.Select(a => new AisleResponseDto
        {
            AisleId = a.AisleId ?? string.Empty,
            UserId = a.UserId,
            LayoutId = a.LayoutId,
            AisleName = a.AisleName,
            AisleOrder = a.AisleOrder,
            LayoutName = layout.LayoutName
        });
    }

    public async Task<AisleResponseDto?> CreateAisleAsync(CreateAisleDto createAisleDto, string userId)
    {
        if (string.IsNullOrWhiteSpace(createAisleDto.AisleName))
            throw new ArgumentException("Aisle name cannot be empty");

        if (string.IsNullOrWhiteSpace(createAisleDto.LayoutId))
            throw new ArgumentException("Layout ID cannot be empty");

        // Verify the layout belongs to the user
        var layout = await _context.Layouts.Find(l => l.LayoutId == createAisleDto.LayoutId && l.UserId == userId).FirstOrDefaultAsync();
        if (layout == null)
            throw new UnauthorizedAccessException("Layout not found or access denied");

        var aisle = new Aisle
        {
            UserId = userId,
            LayoutId = createAisleDto.LayoutId,
            AisleName = createAisleDto.AisleName,
            AisleOrder = createAisleDto.AisleOrder
        };

        await _context.Aisles.InsertOneAsync(aisle);

        return new AisleResponseDto
        {
            AisleId = aisle.AisleId ?? string.Empty,
            UserId = aisle.UserId,
            LayoutId = aisle.LayoutId,
            AisleName = aisle.AisleName,
            AisleOrder = aisle.AisleOrder,
            LayoutName = layout.LayoutName
        };
    }

    public async Task<bool> DeleteAisleAsync(string aisleId, string userId)
    {
        // Verify the aisle belongs to a layout owned by the user
        var aisle = await _context.Aisles.Find(a => a.AisleId == aisleId).FirstOrDefaultAsync();
        if (aisle == null) return false;

        var layout = await _context.Layouts.Find(l => l.LayoutId == aisle.LayoutId && l.UserId == userId).FirstOrDefaultAsync();
        if (layout == null) return false;

        var result = await _context.Aisles.DeleteOneAsync(a => a.AisleId == aisleId);
        return result.DeletedCount > 0;
    }
}
