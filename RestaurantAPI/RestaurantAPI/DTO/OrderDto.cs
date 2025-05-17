namespace RestaurantAPI.DTO
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = "Pending";
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }
}
