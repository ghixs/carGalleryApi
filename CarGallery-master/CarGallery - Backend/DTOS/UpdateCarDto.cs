namespace CarGallery.DTOS
{
    public class UpdateCarDto
    {
        public int Id { get; set; }


        public int CreateUserId { get; set; }
        public int UpdateUserId { get; set; }

        public DateTime? UpdateDate { get; set; } = DateTime.UtcNow;

        public int BrandId { get; set; }
        public required string Model { get; set; }
        public int Year { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Color { get; set; }
        public int Stock { get; set; } = 0;
        public string? City { get; set; }
    }
}
