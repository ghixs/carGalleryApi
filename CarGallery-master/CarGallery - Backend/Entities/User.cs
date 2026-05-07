namespace CarGallery.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "user"; // "super-admin", "gallery-admin", or "user"
        
        // Gallery Admin için - hangi galeriye bağlı
        public int? GalleryId { get; set; }
        public Gallery? Gallery { get; set; }
    }
}
