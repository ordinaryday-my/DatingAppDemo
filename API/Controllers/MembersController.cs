using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository repository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
        return Ok(await repository.GetMembersAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await repository.GetMemberByIdAsync(id);
        if (member is null)
        {
            return NotFound();
        }
        return member;
    }
    
    [HttpGet]
    [Route("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
    {
        var photos = await repository.GetPhotosForMemberAsync(id);
        return Ok(photos);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateMember(MemberUpdatedDto memberUpdatedDto)
    {
        var memberId = User.GetMemberId(); 
        
        var member = await repository.GetMemberForUpdate(memberId) ;

        if (member is null)
            return BadRequest("Could not get member.");
        
        member.DisplayName = memberUpdatedDto.DisplayName ?? member.DisplayName;
        member.Description = memberUpdatedDto.Description ?? member.Description;
        member.City = memberUpdatedDto.City ?? member.City;
        member.Country = memberUpdatedDto.Country ?? member.Country;
        
        member.User.DisplayName = memberUpdatedDto.DisplayName ?? member.User.DisplayName;
        
        repository.Update(member);

        if (await repository.SaveAllAsync())
            return NoContent();
        return BadRequest("Failed to update user or member.");
    }
}

