namespace RestaurantAPI.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int DishId { get; set; }
        public Dish Dish { get; set; } = null!;

        public int Quantity { get; set; } = 1;
    }
}
