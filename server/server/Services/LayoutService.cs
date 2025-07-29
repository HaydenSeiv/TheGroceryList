using MongoDB.Driver;
using server.Data;
using server.DTOs;
using server.Models;

namespace server.Services;

public class LayoutService : ILayoutService
{
    private readonly MongoDbContext _context;

    public LayoutService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LayoutResponseDto>> GetUserLayoutsAsync(string userId)
    {
        var layouts = await _context.Layouts.Find(l => l.UserId == userId).ToListAsync();
        return layouts.Select(l => new LayoutResponseDto
        {
            LayoutId = l.LayoutId ?? string.Empty,
            UserId = l.UserId,
            LayoutName = l.LayoutName
        });
    }

    public async Task<LayoutResponseDto?> CreateLayoutAsync(string userId, CreateLayoutDto createLayoutDto)
    {
        if (string.IsNullOrWhiteSpace(createLayoutDto.LayoutName))
            throw new ArgumentException("Layout name cannot be empty");

        var layout = new Layout
        {
            UserId = userId,
            LayoutName = createLayoutDto.LayoutName
        };

        await _context.Layouts.InsertOneAsync(layout);

        return new LayoutResponseDto
        {
            LayoutId = layout.LayoutId ?? string.Empty,
            UserId = layout.UserId,
            LayoutName = layout.LayoutName
        };
    }

    public async Task<bool> DeleteLayoutAsync(string layoutId, string userId)
    {
        // Ensure the list belongs to the user before deleting
        var result = await _context.Layouts.DeleteOneAsync(l => l.LayoutId == layoutId && l.UserId == userId);
        return result.DeletedCount > 0;
    }
} 