namespace CarGallery.DTOS
{
    public class AddGalleryDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class UpdateGalleryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class GalleryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LogoUrl { get; set; }
        public DateTime CreatedDate { get; set; }
        public int BrandCount { get; set; }
        public int AdminCount { get; set; }
    }

    public class AssignGalleryAdminDto
    {
        public int GalleryId { get; set; }
        public int UserId { get; set; }
    }
}
