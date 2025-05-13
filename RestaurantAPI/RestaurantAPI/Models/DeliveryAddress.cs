﻿public class DeliveryAddress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public double Latitude { get; set; }      
    public double Longitude { get; set; }     
}
