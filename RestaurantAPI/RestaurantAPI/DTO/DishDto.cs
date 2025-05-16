namespace RestaurantAPI.DTO
{
    public class DishDto
    {
        public int Id { get; set; }
        public string NameEn { get; set; } = string.Empty;
        public string NameRu { get; set; } = string.Empty;
        public string NameAz { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public string DescriptionRu { get; set; } = string.Empty;
        public string DescriptionAz { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DishCategoryId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
