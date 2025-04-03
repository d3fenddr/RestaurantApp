using RestaurantAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(UserDto userDto);
        Task<bool> UpdateUserAsync(int id, UserDto userDto);
        Task<bool> DeleteUserAsync(int id);
    }
}
