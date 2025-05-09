﻿namespace RestaurantAPI.Models
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }

        public User User { get; set; } = null!;
    }
}
