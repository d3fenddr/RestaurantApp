namespace RestaurantAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal Total { get; set; }

        // Collection of ordered items
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
