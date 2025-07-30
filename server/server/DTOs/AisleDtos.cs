namespace server.DTOs;

public class CreateAisleDto
{
    public string LayoutId { get; set; } = string.Empty;
    public string AisleName { get; set; } = string.Empty;
    public int? AisleOrder { get; set; } 
}

public class UpdateAisleDto
{
    public required string AisleName { get; set; }
}
public class AisleResponseDto
{
    public string AisleId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string LayoutId { get; set; } = string.Empty;
    public string AisleName { get; set; } = string.Empty;
    public int? AisleOrder { get; set; } 
    public string LayoutName { get; set; } = string.Empty;
}
