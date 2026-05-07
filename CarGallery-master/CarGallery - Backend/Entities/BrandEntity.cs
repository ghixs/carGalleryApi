namespace CarGallery.Entities
{
    public class BrandEntity 
    {
        public int Id { get; set; }
        
        public string BrandName { get; set; }
        
        // Gallery ile ilişki
        public int? GalleryId { get; set; }
        public Gallery? Gallery { get; set; }

        public virtual ICollection<Car> Cars { get; set; } = new List<Car>();

        public bool IsDeleted { get; set; } = false;

        public DateTime? UpdateDate { get; set; } = DateTime.UtcNow;

        public DateTime CreatedDate {  get; set; } = DateTime.UtcNow;

    }
}
