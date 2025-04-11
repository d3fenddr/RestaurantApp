using System.Threading.Tasks;
using RestaurantAPI.DTO;
using RestaurantAPI.Models;

namespace RestaurantAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequestDto request);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        string RefreshAccessToken(User user);
    }
}
