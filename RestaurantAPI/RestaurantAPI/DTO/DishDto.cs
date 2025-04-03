namespace RestaurantAPI.DTO
{
    public class DishDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        // Assuming DishCategory is represented by its Id
        public int DishCategoryId { get; set; }
    }
}
