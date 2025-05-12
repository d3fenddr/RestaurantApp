using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;


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
    public async Task<IActionResult> SaveAddress([FromBody] DeliveryAddress address)
    {
        _context.DeliveryAddresses.Add(address);
        await _context.SaveChangesAsync();
        return Ok(address);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAddress(int userId)
    {
        var address = await _context.DeliveryAddresses.FirstOrDefaultAsync(a => a.UserId == userId);
        return Ok(address);
    }
}
