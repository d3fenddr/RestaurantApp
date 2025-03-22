namespace RestaurantAPI.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime Date { get; set; }
        public int Guests { get; set; }
        public string SpecialRequest { get; set; }
    }
}
