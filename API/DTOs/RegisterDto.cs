using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/// <summary>
///  用户注册数据传输对象
/// </summary>
public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(4)]
    public string Password { get; set; } = "";
    [Required]
    public string DisplayName { get; set; } = "";
}
