namespace CarGallery.Entities
{
    public class Car : BaseEntity
    {
        public int? BrandId { get; set; }
        public BrandEntity? Brand { get; set; }

        public required string Model { get; set; }
        public int Year { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Color { get; set; }
        public int Stock { get; set; } = 0;
        public string? City { get; set; } // İl bilgisi
        public List<string>? ImageUrls { get; set; }
    }
}
