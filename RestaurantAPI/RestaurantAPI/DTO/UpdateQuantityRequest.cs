namespace RestaurantAPI.DTO
{
    public class UpdateQuantityRequest
    {
        public int UserId { get; set; }
        public int DishId { get; set; }
        public int Delta { get; set; }
    }
}
