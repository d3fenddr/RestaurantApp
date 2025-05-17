namespace RestaurantAPI.DTO
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DishId { get; set; }
        public int Quantity { get; set; }
        public DishDto Dish { get; set; }
    }

}
