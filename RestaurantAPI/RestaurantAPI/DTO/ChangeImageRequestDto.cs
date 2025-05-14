using Microsoft.AspNetCore.Http;

namespace RestaurantAPI.DTO
{
    public class ChangeImageRequestDto
    {
        public string OldImageUrl { get; set; }
        public IFormFile NewImage { get; set; }
    }
}
