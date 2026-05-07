namespace CarGallery.DTOS
{
    public class UpdateBrandDto
    {

        public int Id { get; set; }
        public string BrandName { get; set; } = null!;

        public DateTime? UpdateDate { get; set; } = DateTime.UtcNow;
        public int? UserId { get; set; } // Yetki kontrolü için
    }
}
