namespace RestaurantAPI.Models
{
    public class Table
    {
        public int Id { get; set; }
        public int Number { get; set; }       
        public int Capacity { get; set; }     
        public bool IsAvailable { get; set; } = true;
    }
}