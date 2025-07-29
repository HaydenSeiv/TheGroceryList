namespace server.DTOs;

public class CreateLayoutDto
{
    public required string LayoutName { get; set; }
}

public class LayoutResponseDto
{
    public string LayoutId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string LayoutName { get; set; } = string.Empty;
}