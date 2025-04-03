namespace RestaurantAPI.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        // This field is used only for input (creation or update). It is not returned in GET responses.
        public string? Password { get; set; }
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; }
    }
}