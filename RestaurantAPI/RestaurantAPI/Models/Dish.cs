namespace RestaurantAPI.Models
{
    public class Dish
    {
        public int Id { get; set; }
        public string NameEn { get; set; } = string.Empty;
        public string NameRu { get; set; } = string.Empty;
        public string NameAz { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public string DescriptionRu { get; set; } = string.Empty;
        public string DescriptionAz { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // Azure Blob Storage URL

        // Foreign key to Category
        public int DishCategoryId { get; set; }
        public DishCategory? DishCategory { get; set; } = null!;
    }
}
