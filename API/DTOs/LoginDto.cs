namespace API.DTOs;

/// <summary>
/// 用户登录数据传输对象
/// </summary>
public class LoginDto
{
    public string? Password { get; set; }
    public string? Email { get; set; }
}
