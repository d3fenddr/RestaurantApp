using RestaurantAPI.DTO;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterRequestDto request);
    Task<string> LoginAsync(LoginRequestDto request);
}
