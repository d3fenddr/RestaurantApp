namespace RestaurantAPI.Models
{
    public class Dish
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // Azure Blob Storage URL

        // Foreign key to Category
        public int CategoryId { get; set; }
        public DishCategory Category { get; set; } = null!;
    }
}
