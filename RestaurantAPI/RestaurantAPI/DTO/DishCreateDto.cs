namespace RestaurantAPI.DTO
{
    public class DishCreateDto
    {
        public string NameEn { get; set; }
        public string NameRu { get; set; }
        public string NameAz { get; set; }
        public string DescriptionEn { get; set; }
        public string DescriptionRu { get; set; }
        public string DescriptionAz { get; set; }
        public decimal Price { get; set; }
        public int DishCategoryId { get; set; }
        public IFormFile? Image { get; set; }
    }
}
