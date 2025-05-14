using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTO;
using RestaurantAPI.Services.Interfaces;
using System.Security.Claims;

namespace RestaurantAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageUploadController : ControllerBase
    {
        private readonly IBlobStorageService _blobStorageService;
        private readonly IUserService _userService;
        private readonly IDishService _dishService;

        public ImageUploadController(
            IBlobStorageService blobStorageService,
            IUserService userService,
            IDishService dishService)
        {
            _blobStorageService = blobStorageService;
            _userService = userService;
            _dishService = dishService;
        }

        // ---------------------- USER ----------------------

        [Authorize]
        [HttpPost("user-avatar")]
        public async Task<ActionResult<ImageUploadResponseDto>> UploadUserAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var url = await _blobStorageService.UploadFileAsync(file, "users");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _userService.UpdateAvatarUrlAsync(userId, url);

            return Ok(new ImageUploadResponseDto { ImageUrl = url });
        }

        [Authorize]
        [HttpDelete("user-avatar")]
        public async Task<IActionResult> DeleteUserAvatar([FromQuery] string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return BadRequest("Image URL is required");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            await _blobStorageService.DeleteFileAsync(imageUrl, "users");
            await _userService.UpdateAvatarUrlAsync(userId, null!);

            return NoContent();
        }

        [Authorize]
        [HttpPost("change-user-avatar")]
        public async Task<ActionResult<ImageUploadResponseDto>> ChangeUserAvatar([FromForm] ChangeImageRequestDto request)
        {
            if (request.NewImage == null || request.NewImage.Length == 0)
                return BadRequest("New image required");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            await _blobStorageService.DeleteFileAsync(request.OldImageUrl, "users");
            var newUrl = await _blobStorageService.UploadFileAsync(request.NewImage, "users");
            await _userService.UpdateAvatarUrlAsync(userId, newUrl);

            return Ok(new ImageUploadResponseDto { ImageUrl = newUrl });
        }

        // ---------------------- DISH ----------------------

        [Authorize(Roles = "Admin")]
        [HttpPost("dish-photo/{dishId}")]
        public async Task<ActionResult<ImageUploadResponseDto>> UploadDishPhoto(int dishId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var url = await _blobStorageService.UploadFileAsync(file, "dishes");
            await _dishService.UpdateImageUrlAsync(dishId, url);

            return Ok(new ImageUploadResponseDto { ImageUrl = url });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("dish-photo/{dishId}")]
        public async Task<IActionResult> DeleteDishPhoto(int dishId, [FromQuery] string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return BadRequest("Image URL is required");

            await _blobStorageService.DeleteFileAsync(imageUrl, "dishes");
            await _dishService.UpdateImageUrlAsync(dishId, null!);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("change-dish-photo/{dishId}")]
        public async Task<ActionResult<ImageUploadResponseDto>> ChangeDishPhoto(int dishId, [FromForm] ChangeImageRequestDto request)
        {
            if (request.NewImage == null || request.NewImage.Length == 0)
                return BadRequest("New image required");

            await _blobStorageService.DeleteFileAsync(request.OldImageUrl, "dishes");
            var newUrl = await _blobStorageService.UploadFileAsync(request.NewImage, "dishes");
            await _dishService.UpdateImageUrlAsync(dishId, newUrl);

            return Ok(new ImageUploadResponseDto { ImageUrl = newUrl });
        }
    }
}
