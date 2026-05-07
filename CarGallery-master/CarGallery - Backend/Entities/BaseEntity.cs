namespace CarGallery.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;   
        public int CreateUserId { get; set; }

        public DateTime? UpdateDate { get; set; } 
        public int? UpdateUserId { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

    }
}
