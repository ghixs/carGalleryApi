namespace CarGallery.DTOS
{
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public int? GalleryId { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class UpdateUserRoleDto
    {
        public int UserId { get; set; }
        public string Role { get; set; }
    }
}
