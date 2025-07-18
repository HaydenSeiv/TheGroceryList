namespace server.DTOs;

public class CreateItemDto
{
    public required string ListId { get; set; }
    public required string Title { get; set; }
    public string? Category { get; set; }
    public int? CatID { get; set; }
}

public class UpdateItemDto
{
    public required string Title { get; set; }
}

public class ItemResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string ListId { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int? CatID { get; set; }
} 