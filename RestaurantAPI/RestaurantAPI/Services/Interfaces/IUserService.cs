using RestaurantAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantAPI.Models;
using RestaurantAPI.DTO;

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
        Task<ChangePasswordResult> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
    }
}
