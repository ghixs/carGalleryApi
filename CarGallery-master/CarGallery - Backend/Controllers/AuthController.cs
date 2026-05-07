using Microsoft.AspNetCore.Mvc;
using CarGallery.Data;
using CarGallery.DTOS;
using CarGallery.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace CarGallery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public AuthController(CarGalleryContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            // Kullanıcı adı zaten var mı kontrol et
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest(new { message = "Bu kullanıcı adı zaten kullanılıyor" });
            }

            // İlk kullanıcı mı kontrol et
            var isFirstUser = !await _context.Users.AnyAsync();

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = HashPassword(dto.Password),
                Role = isFirstUser ? "super-admin" : "user", // İlk kullanıcı super-admin olur
                CreateUserId = 1
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                GalleryId = user.GalleryId,
                CreatedDate = user.CreatedDate
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .Where(u => !u.IsDeleted && u.Username == dto.Username)
                .FirstOrDefaultAsync();

            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });
            }

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                GalleryId = user.GalleryId,
                CreatedDate = user.CreatedDate
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Role = u.Role,
                    GalleryId = u.GalleryId,
                    CreatedDate = u.CreatedDate
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("users/role")]
        public async Task<IActionResult> UpdateUserRole(UpdateUserRoleDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);

            if (user == null || user.IsDeleted)
                return NotFound(new { message = "Kullanıcı bulunamadı" });

            if (dto.Role != "super-admin" && dto.Role != "gallery-admin" && dto.Role != "user")
                return BadRequest(new { message = "Geçersiz rol. 'super-admin', 'gallery-admin' veya 'user' olmalı" });

            user.Role = dto.Role;
            user.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                GalleryId = user.GalleryId,
                CreatedDate = user.CreatedDate
            });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "Kullanıcı bulunamadı" });

            // İlk super-admin'i silmeyi engelle
            var isFirstUser = await _context.Users
                .OrderBy(u => u.Id)
                .FirstOrDefaultAsync();

            if (isFirstUser?.Id == id && user.Role == "super-admin")
                return BadRequest(new { message = "İlk super-admin kullanıcı silinemez" });

            user.IsDeleted = true;
            user.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}
