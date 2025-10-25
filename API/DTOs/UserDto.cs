namespace API.DTOs;

/// <summary>
///  用户数据传输对象，包含用户的基本信息和身份验证令牌
/// </summary>
public class UserDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public required string Token { get; set; }
    public string? ImageUrl { get; set; }
}
