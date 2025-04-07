using RestaurantAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantAPI.Models;

namespace RestaurantAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(UserDto userDto);
        Task<bool> UpdateUserAsync(int id, UserDto userDto);
        Task<bool> DeleteUserAsync(int id);
        Task<User> Authenticate(string email, string password);
    }
}
