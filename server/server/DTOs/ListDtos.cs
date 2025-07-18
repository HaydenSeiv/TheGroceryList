namespace server.DTOs;

public class CreateListDto
{
    public required string ListName { get; set; }
}

public class ListResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string ListName { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; }
} 