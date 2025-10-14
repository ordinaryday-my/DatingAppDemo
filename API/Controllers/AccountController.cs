using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers;

/// <summary>
/// 此控制器用于处理用户账户相关的操作
/// </summary>
/// <param name="context">注入的数据库上下文</param>
/// <param name="tokenService">注入的令牌服务</param>
public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{

    /// <summary>
    /// 用户注册接口
    /// </summary>
    /// <param name="dto">用户注册数据传输对象</param>
    /// <returns>返回创建的用户对象</returns>
    [SwaggerOperation(Summary = "用户注册接口", Description = "用于注册新用户")]
    [SwaggerResponse(200, "成功注册并返回用户对象", typeof(AppUser))]
    [SwaggerResponse(400, "请求无效")]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        if (await EmailExists(dto.Email)) return BadRequest("Email already in use");

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            DisplayName = dto.DisplayName,
            Email = dto.Email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user.ToDto(tokenService);
    }

    /// <summary>
    /// 用户登录接口
    /// </summary>
    /// <param name="dto">用户数据的传输对象</param>
    /// <returns>已经注册的用户对象</returns>
    [SwaggerOperation(Summary = "用户登录接口", Description = "用于用户登录")]
    [SwaggerResponse(200, "成功登录并返回用户对象", typeof(AppUser))]
    [SwaggerResponse(400, "请求无效")]
    [SwaggerResponse(401, "未授权，登录失败")]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        if (dto.Email == null || dto.Password == null)
            return BadRequest("Email and Password must be provided.");
        var user = await context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null) return Unauthorized("Invalid email address");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));

        if (!user.PasswordHash.SequenceEqual(computedHash))
            return Unauthorized("Invalid password");

        return user.ToDto(tokenService);
    }

    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(u => u.Email.ToLower().Equals(email.ToLower()));
    }
}