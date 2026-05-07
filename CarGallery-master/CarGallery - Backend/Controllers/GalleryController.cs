using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarGallery.Data;
using CarGallery.Entities;
using CarGallery.DTOS;
using System.Security.Claims;

namespace CarGallery.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public GalleryController(CarGalleryContext context)
        {
            _context = context;
        }

        // GET: api/Gallery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalleryDto>>> GetGalleries()
        {
            var galleries = await _context.Galleries
                .Where(g => !g.IsDeleted)
                .Include(g => g.Brands)
                .Include(g => g.GalleryAdmins)
                .Select(g => new GalleryDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    Address = g.Address,
                    Phone = g.Phone,
                    Email = g.Email,
                    LogoUrl = g.LogoUrl,
                    CreatedDate = g.CreatedDate,
                    BrandCount = g.Brands.Count(b => !b.IsDeleted),
                    AdminCount = g.GalleryAdmins.Count(u => !u.IsDeleted)
                })
                .ToListAsync();

            return Ok(galleries);
        }

        // GET: api/Gallery/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GalleryDto>> GetGallery(int id)
        {
            var gallery = await _context.Galleries
                .Where(g => g.Id == id && !g.IsDeleted)
                .Include(g => g.Brands)
                .Include(g => g.GalleryAdmins)
                .Select(g => new GalleryDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    Address = g.Address,
                    Phone = g.Phone,
                    Email = g.Email,
                    LogoUrl = g.LogoUrl,
                    CreatedDate = g.CreatedDate,
                    BrandCount = g.Brands.Count(b => !b.IsDeleted),
                    AdminCount = g.GalleryAdmins.Count(u => !u.IsDeleted)
                })
                .FirstOrDefaultAsync();

            if (gallery == null)
            {
                return NotFound();
            }

            return Ok(gallery);
        }

        // POST: api/Gallery
        [HttpPost]
        public async Task<ActionResult<Gallery>> CreateGallery(AddGalleryDto dto)
        {
            // Geçici olarak authentication kontrolünü kaldırdık
            // TODO: JWT authentication eklenecek
            
            var gallery = new Gallery
            {
                Name = dto.Name,
                Description = dto.Description,
                Address = dto.Address,
                Phone = dto.Phone,
                Email = dto.Email,
                LogoUrl = dto.LogoUrl
            };

            _context.Galleries.Add(gallery);
            await _context.SaveChangesAsync();

            // DTO olarak döndür, entity değil (circular reference önlemek için)
            var result = new
            {
                id = gallery.Id,
                name = gallery.Name,
                description = gallery.Description,
                address = gallery.Address,
                phone = gallery.Phone,
                email = gallery.Email,
                logoUrl = gallery.LogoUrl,
                createdDate = gallery.CreatedDate,
                brandCount = 0,
                adminCount = 0
            };

            return CreatedAtAction(nameof(GetGallery), new { id = gallery.Id }, result);
        }

        // PUT: api/Gallery/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGallery(int id, UpdateGalleryDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            // Geçici olarak authentication kontrolünü kaldırdık
            
            var gallery = await _context.Galleries.FindAsync(id);
            if (gallery == null || gallery.IsDeleted)
            {
                return NotFound();
            }

            gallery.Name = dto.Name;
            gallery.Description = dto.Description;
            gallery.Address = dto.Address;
            gallery.Phone = dto.Phone;
            gallery.Email = dto.Email;
            gallery.LogoUrl = dto.LogoUrl;
            gallery.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Gallery/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGallery(int id)
        {
            // Geçici olarak authentication kontrolünü kaldırdık
            
            var gallery = await _context.Galleries.FindAsync(id);
            if (gallery == null)
            {
                return NotFound();
            }

            gallery.IsDeleted = true;
            gallery.UpdateDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Gallery/assign-admin
        [HttpPost("assign-admin")]
        public async Task<IActionResult> AssignGalleryAdmin(AssignGalleryAdminDto dto)
        {
            // Geçici olarak authentication kontrolünü kaldırdık
            
            var gallery = await _context.Galleries.FindAsync(dto.GalleryId);
            if (gallery == null || gallery.IsDeleted)
            {
                return NotFound("Gallery not found");
            }

            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null || user.IsDeleted)
            {
                return NotFound("User not found");
            }

            user.Role = "gallery-admin";
            user.GalleryId = dto.GalleryId;
            user.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Gallery admin assigned successfully" });
        }

        // POST: api/Gallery/remove-admin/{userId}
        [HttpPost("remove-admin/{userId}")]
        public async Task<IActionResult> RemoveGalleryAdmin(int userId)
        {
            // Geçici olarak authentication kontrolünü kaldırdık
            
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted)
            {
                return NotFound("User not found");
            }

            user.Role = "user";
            user.GalleryId = null;
            user.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Gallery admin role removed successfully" });
        }
    }
}
