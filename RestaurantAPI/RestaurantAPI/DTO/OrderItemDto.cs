namespace RestaurantAPI.DTO
{
    public class OrderItemDto
    {
        public int DishId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
