using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public DateTime BookingTime { get; set; } 
        public int TableId { get; set; }          
        public Table? Table { get; set; }          
        public string? UserEmail { get; set; }     
    }
}