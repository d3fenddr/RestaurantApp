﻿namespace RestaurantAPI.DTO
{
    public class DishDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DishCategoryId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
    }
}