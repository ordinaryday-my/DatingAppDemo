using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUser(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options = new System.Text.Json.JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        
        var members = System.Text.Json.JsonSerializer.Deserialize<List<SeedUserDto>>(userData, options);

        if (members == null)
        {
            Console.Write("No member in seed data.");
            return;
        }

        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();
            
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Gender = member.Id,
                    City = member.City,
                    Country = member.Country,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    LastActive = member.LastActive,
                    Created = member.Created
                }
            };
            
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!,
                MemberId = member.Id,
            });
            
            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
    }
}