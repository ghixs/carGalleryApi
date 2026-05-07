namespace CarGallery.Entities
{
    public class Gallery : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LogoUrl { get; set; }
        
        // İlişkiler
        public virtual ICollection<BrandEntity> Brands { get; set; } = new List<BrandEntity>();
        public virtual ICollection<User> GalleryAdmins { get; set; } = new List<User>();
    }
}
