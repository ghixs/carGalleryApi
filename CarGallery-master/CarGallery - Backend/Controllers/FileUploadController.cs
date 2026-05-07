using Microsoft.AspNetCore.Mvc;

namespace CarGallery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public FileUploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Dosya seçilmedi" });

            // Sadece resim dosyalarına izin ver
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Sadece resim dosyaları yüklenebilir (jpg, jpeg, png, gif, webp)" });

            // Maksimum dosya boyutu kontrolü (5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Dosya boyutu 5MB'dan küçük olmalıdır" });

            try
            {
                // Benzersiz dosya adı oluştur
                var fileName = $"{Guid.NewGuid()}{extension}";
                var imagesPath = Path.Combine(_environment.WebRootPath, "images");

                // Images klasörünü oluştur (yoksa)
                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }

                var filePath = Path.Combine(imagesPath, fileName);

                // Dosyayı kaydet
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // URL'i döndür
                var imageUrl = $"/images/{fileName}";
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Dosya yüklenirken hata oluştu: {ex.Message}" });
            }
        }

        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultipleImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "Dosya seçilmedi" });

            var uploadedUrls = new List<string>();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

            try
            {
                var imagesPath = Path.Combine(_environment.WebRootPath, "images");

                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }

                foreach (var file in files)
                {
                    if (file.Length == 0) continue;

                    var extension = Path.GetExtension(file.FileName).ToLower();

                    if (!allowedExtensions.Contains(extension))
                        continue;

                    if (file.Length > 5 * 1024 * 1024)
                        continue;

                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(imagesPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    uploadedUrls.Add($"/images/{fileName}");
                }

                if (uploadedUrls.Count == 0)
                    return BadRequest(new { message = "Geçerli dosya yüklenemedi" });

                return Ok(new { imageUrls = uploadedUrls });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Dosyalar yüklenirken hata oluştu: {ex.Message}" });
            }
        }

        [HttpDelete("delete")]
        public IActionResult DeleteImage([FromQuery] string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return BadRequest(new { message = "Resim URL'i gerekli" });

            try
            {
                // URL'den dosya adını çıkar
                var fileName = Path.GetFileName(imageUrl);
                var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { message = "Resim silindi" });
                }

                return NotFound(new { message = "Resim bulunamadı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Resim silinirken hata oluştu: {ex.Message}" });
            }
        }
    }
}
