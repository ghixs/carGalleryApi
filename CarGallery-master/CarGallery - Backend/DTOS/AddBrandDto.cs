namespace CarGallery.DTOS
{
    public class AddBrandDto
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public int? GalleryId { get; set; } // Super-admin için
        public int? UserId { get; set; } // Yetki kontrolü için
    }
}
