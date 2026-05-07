using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CarGallery.Data;
using CarGallery.DTOS;
using CarGallery.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CarGallery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public BrandController(CarGalleryContext context)
        {
            _context = context;
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Create(AddBrandDto dto)
        {
            // Eğer userId verilmişse, kullanıcının yetkisini kontrol et
            if (dto.UserId.HasValue)
            {
                var user = await _context.Users.FindAsync(dto.UserId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisine marka ekleyebilir
                    if (dto.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid("Gallery-admin sadece kendi galerisine marka ekleyebilir");
                    }
                }
            }
            
            var brand = new BrandEntity
            {
                BrandName = dto.BrandName,
                GalleryId = dto.GalleryId,
                UpdateDate = null
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            // Gallery bilgisini al
            var gallery = dto.GalleryId.HasValue 
                ? await _context.Galleries.FindAsync(dto.GalleryId.Value) 
                : null;

            // DTO olarak döndür, entity değil (circular reference önlemek için)
            var result = new
            {
                id = brand.Id,
                brandName = brand.BrandName,
                galleryId = brand.GalleryId,
                galleryName = gallery?.Name,
                createdDate = brand.CreatedDate
            };

            return CreatedAtAction(nameof(GetById), new { id = brand.Id }, result);
        }
     

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll([FromQuery] int? userId = null)
        {
            IQueryable<BrandEntity> brandsQuery = _context.Brands
                .Where(x => !x.IsDeleted)
                .Include(b => b.Gallery);

            // Eğer userId verilmişse, kullanıcının rolüne göre filtrele
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin markalarını görebilir
                    brandsQuery = brandsQuery.Where(b => b.GalleryId == user.GalleryId.Value);
                }
                // super-admin veya user ise tüm markaları görebilir (filtreleme yok)
            }
            
            var brands = await brandsQuery
                .Select(z => new
                {
                    z.BrandName,
                    z.Id,
                    z.GalleryId,
                    GalleryName = z.Gallery != null ? z.Gallery.Name : null,
                    z.CreatedDate,
                    z.UpdateDate
                })
                .ToListAsync();

            return Ok(brands);
        }
        [HttpGet("Get by id")]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _context.Brands
                .Where(b => b.Id == id && !b.IsDeleted)
                .Include(b => b.Gallery)
                .Select(b => new
                {
                    b.Id,
                    b.BrandName,
                    b.GalleryId,
                    GalleryName = b.Gallery != null ? b.Gallery.Name : null,
                    b.CreatedDate,
                    b.UpdateDate
                })
                .FirstOrDefaultAsync();

            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateBrandDto dto)
        {
            var brand = await _context.Brands.FindAsync(dto.Id);

            if (brand == null)
                return NotFound();

            // Eğer userId verilmişse, kullanıcının yetkisini kontrol et
            if (dto.UserId.HasValue)
            {
                var user = await _context.Users.FindAsync(dto.UserId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin markasını güncelleyebilir
                    if (brand.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid("Gallery-admin sadece kendi galerisinin markalarını güncelleyebilir");
                    }
                }
            }
            
            brand.BrandName = dto.BrandName;
            brand.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            // DTO olarak döndür
            var gallery = brand.GalleryId.HasValue 
                ? await _context.Galleries.FindAsync(brand.GalleryId.Value) 
                : null;

            var result = new
            {
                id = brand.Id,
                brandName = brand.BrandName,
                galleryId = brand.GalleryId,
                galleryName = gallery?.Name,
                createdDate = brand.CreatedDate,
                updateDate = brand.UpdateDate
            };

            return Ok(result);
        }


        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int? userId = null)
        {
            var brand = await _context.Brands.FindAsync(id);

            if(brand == null)
                return NotFound();

            // Eğer userId verilmişse, kullanıcının yetkisini kontrol et
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin markasını silebilir
                    if (brand.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid("Gallery-admin sadece kendi galerisinin markalarını silebilir");
                    }
                }
            }
            
            brand.IsDeleted = true;
            brand.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
