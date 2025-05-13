using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.Models.DTOs;


[Route("api/address")]
[ApiController]
public class DeliveryAddressController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DeliveryAddressController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SaveAddress([FromBody] DeliveryAddressDto dto)
    {
        try
        {
            var address = new DeliveryAddress
            {
                UserId = dto.UserId,
                Country = dto.Country,
                City = dto.City,
                Street = dto.Street,
                PostalCode = dto.PostalCode,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude
            };

            var existing = await _context.DeliveryAddresses
                .FirstOrDefaultAsync(a => a.UserId == dto.UserId);

            if (existing != null)
            {
                existing.Country = dto.Country;
                existing.City = dto.City;
                existing.Street = dto.Street;
                existing.PostalCode = dto.PostalCode;
                existing.Latitude = dto.Latitude;
                existing.Longitude = dto.Longitude;
            }
            else
            {
                _context.DeliveryAddresses.Add(address);
            }

            await _context.SaveChangesAsync();
            return Ok(address);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAddress(int userId)
    {
        var address = await _context.DeliveryAddresses.FirstOrDefaultAsync(a => a.UserId == userId);
        return Ok(address);
    }
}
