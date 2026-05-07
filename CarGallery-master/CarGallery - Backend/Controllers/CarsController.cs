using CarGallery.Data;
using CarGallery.DTOS;
using CarGallery.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CarGallery.Controllers
{ [ApiController]
    [Route("api/[controller]")]

    public class CarsController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public CarsController(CarGalleryContext context)
        {
            _context = context;
        }

        [HttpGet("Get All")]
        public async Task<IActionResult> GetAll([FromQuery] int? userId = null)
        {
            IQueryable<Car> carsQuery = _context.Cars
                .Where(x => !x.IsDeleted)
                .Include(x => x.Brand)
                .ThenInclude(b => b!.Gallery);

            // Eğer userId verilmişse, kullanıcının rolüne göre filtrele
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin arabalarını görebilir
                    carsQuery = carsQuery.Where(c => c.Brand != null && c.Brand.GalleryId == user.GalleryId.Value);
                }
                // super-admin veya user ise tüm arabaları görebilir (filtreleme yok)
            }
            
            var cars = await carsQuery
                .Select(r => new
                {
                    BrandName = r.Brand != null ? r.Brand.BrandName : "",
                    GalleryName = r.Brand != null && r.Brand.Gallery != null ? r.Brand.Gallery.Name : null,
                    GalleryLogoUrl = r.Brand != null && r.Brand.Gallery != null ? r.Brand.Gallery.LogoUrl : null,
                    r.Model,
                    r.Year,
                    r.Price,
                    r.Id,
                    r.ImageUrl,
                    r.ImageUrls,
                    r.Color,
                    r.Stock,
                    r.City,
                    r.CreatedDate,
                    r.CreateUserId,
                    r.UpdateDate,
                    r.UpdateUserId
                })
                .ToListAsync();
            return Ok(cars);
        }


        [HttpGet("Get by id")]
        public async Task<IActionResult> GetById(int id)
        {
            var car = await _context.Cars
                .Where(x => !x.IsDeleted && x.Id == id)
                .Include(x => x.Brand)
                .ThenInclude(b => b!.Gallery)
                .Select(r => new
                {
                    BrandName = r.Brand != null ? r.Brand.BrandName : "",
                    GalleryName = r.Brand != null && r.Brand.Gallery != null ? r.Brand.Gallery.Name : null,
                    GalleryLogoUrl = r.Brand != null && r.Brand.Gallery != null ? r.Brand.Gallery.LogoUrl : null,
                    r.Model,
                    r.Year,
                    r.Price,
                    r.Id,
                    r.ImageUrl,
                    r.ImageUrls,
                    r.Color,
                    r.Stock,
                    r.City,
                    r.CreatedDate,
                    r.CreateUserId,
                    r.UpdateDate,
                    r.UpdateUserId
                })
                .FirstOrDefaultAsync();

            if (car == null)
            {
                return NotFound(new { message = "Araç bulunamadı" });
            }

            return Ok(car);
        }

        [HttpPost("Post")]
        public async Task<IActionResult>  Create(AddCarDto dto)
        {
            // BrandId validation
            if (dto.BrandId <= 0)
            {
                return BadRequest(new { message = "Lütfen bir marka seçin (Please select a brand)" });
            }

            var brand = await _context.Brands.Include(b => b.Gallery).FirstOrDefaultAsync(b => b.Id == dto.BrandId);
            if (brand == null || brand.IsDeleted)
            {
                return BadRequest(new { message = "Seçilen marka bulunamadı (Brand not found)" });
            }

            // Eğer createUserId verilmişse, kullanıcının yetkisini kontrol et
            if (dto.CreateUserId > 0)
            {
                var user = await _context.Users.FindAsync(dto.CreateUserId);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin markasına araba ekleyebilir
                    if (brand.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid($"Sadece kendi galerinizin markalarına araba ekleyebilirsiniz. Bu marka '{brand.Gallery?.Name ?? "başka bir galeri"}' galerisine ait.");
                    }
                }
            }

            var car = new Car
            {
                BrandId = dto.BrandId,
                CreateUserId = dto.CreateUserId,
                Model = dto.Model,
                Year = dto.Year,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Color = dto.Color,
                Stock = dto.Stock,
                City = dto.City
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            // DTO olarak döndür, entity değil (circular reference önlemek için)
            var result = new
            {
                id = car.Id,
                brandId = car.BrandId,
                brandName = brand.BrandName,
                galleryName = brand.Gallery?.Name,
                galleryLogoUrl = brand.Gallery?.LogoUrl,
                model = car.Model,
                year = car.Year,
                price = car.Price,
                imageUrl = car.ImageUrl,
                color = car.Color,
                stock = car.Stock,
                city = car.City,
                createdDate = car.CreatedDate,
                createUserId = car.CreateUserId
            };

            return CreatedAtAction(nameof(GetById), new { id = car.Id }, result);
        }


        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCarDto dto)
        {
            var existingCar = await _context.Cars.Include(c => c.Brand).FirstOrDefaultAsync(c => c.Id == dto.Id);

            if (existingCar == null)
                return NotFound();

            // Eğer updateUserId verilmişse, kullanıcının yetkisini kontrol et
            if (dto.UpdateUserId > 0)
            {
                var user = await _context.Users.FindAsync(dto.UpdateUserId);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin arabalarını güncelleyebilir
                    if (existingCar.Brand?.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid("Gallery-admin sadece kendi galerisinin arabalarını güncelleyebilir");
                    }

                    // Yeni marka da kendi galerisinde olmalı
                    if (dto.BrandId != existingCar.BrandId)
                    {
                        var newBrand = await _context.Brands.FindAsync(dto.BrandId);
                        if (newBrand == null || newBrand.GalleryId != user.GalleryId.Value)
                        {
                            return Forbid("Gallery-admin sadece kendi galerisinin markalarını atayabilir");
                        }
                    }
                }
            }

            existingCar.Model = dto.Model;
            existingCar.Year = dto.Year;
            existingCar.Price = dto.Price;
            existingCar.UpdateDate = DateTime.UtcNow;
            existingCar.BrandId = dto.BrandId;
            existingCar.ImageUrl = dto.ImageUrl;
            existingCar.Color = dto.Color;
            existingCar.Stock = dto.Stock;
            existingCar.City = dto.City;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("UpdateImages/{id}")]
        public async Task<IActionResult> UpdateImages(int id, [FromBody] List<string> imageUrls, [FromQuery] int? userId = null)
        {
            var existingCar = await _context.Cars
                .Include(c => c.Brand)
                .ThenInclude(b => b!.Gallery)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingCar == null)
                return NotFound();

            // Eğer userId verilmişse, kullanıcının yetkisini kontrol et
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin arabalarının fotoğraflarını güncelleyebilir
                    if (existingCar.Brand?.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid("Sadece kendi galerinizin arabalarının fotoğraflarını güncelleyebilirsiniz");
                    }
                }
            }

            existingCar.ImageUrls = imageUrls;
            existingCar.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int? userId = null)
        {
            var car = await _context.Cars.Include(c => c.Brand).FirstOrDefaultAsync(c => c.Id == id);

            if (car == null)
                return NotFound();

            // Eğer userId verilmişse, kullanıcının yetkisini kontrol et
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Role == "gallery-admin" && user.GalleryId.HasValue)
                {
                    // Gallery-admin sadece kendi galerisinin arabalarını silebilir
                    if (car.Brand?.GalleryId != user.GalleryId.Value)
                    {
                        return Forbid("Gallery-admin sadece kendi galerisinin arabalarını silebilir");
                    }
                }
            }

            car.IsDeleted = true;
            car.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();  

            return NoContent();
        }
       
    }
}
