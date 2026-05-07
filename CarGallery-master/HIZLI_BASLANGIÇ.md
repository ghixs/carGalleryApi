# 🚗 Gallery System - Hızlı Başlangıç Rehberi

## ✅ Sistem Hazır!

### 🎯 Oluşturulan Özellikler:

1. **Gallery (Galeri) Sistemi** - Brand ve Car gibi yeni bir entity
2. **3 Rol Seviyesi:**
   - **Super-Admin** - Tüm sisteme erişim
   - **Gallery-Admin** - Sadece kendi galerisine erişim
   - **User** - Normal kullanıcı

3. **Multi-Tenancy (Çoklu Kiracı)** - Her galeri kendi verilerini yönetir

## 🚀 Nasıl Kullanılır?

### 1. Sistemleri Çalıştır

✅ Backend: `http://localhost:5000` - **ÇALIŞIYOR**
✅ Frontend: `http://localhost:3000` - **ÇALIŞIYOR**

### 2. Super-Admin Olarak Giriş Yap

```
URL: http://localhost:3000/login
Username: admin
Password: admin
```

✅ **Super-admin rolü ayarlandı!**

### 3. İlk Galeriyi Oluştur

1. Admin Panel'e git
2. **🏢 Galleries** menüsüne tıkla
3. **"+ Add New Gallery"** butonuna tıkla
4. Örnek:
   ```
   Name: Otobin
   Description: Premium araç galerisi
   Address: İstanbul, Türkiye
   Phone: +90 555 123 4567
   Email: info@otobin.com
   ```
5. **Add** butonuna tıkla

### 4. Gallery Admin Ata

1. Galleries tablosunda **"Assign Admin"** butonuna tıkla
2. Bir kullanıcı seç (örn: "bab ayak")
3. **"Assign Admin"** butonuna tıkla
4. ✅ Kullanıcı artık **Otobin Gallery Admin**!

### 5. Gallery Admin Olarak Test Et

1. Çıkış yap
2. Gallery Admin kullanıcısı ile giriş yap
3. **🏷️ Brands** menüsüne git
4. Marka ekle - **Otomatik olarak Otobin'e atanır!**
5. **🚘 Cars** menüsüne git
6. Araba ekle - **Sadece Otobin markalarını görebilirsin!**

## 🔒 Güvenlik Özellikleri

### Gallery Admin Kısıtlamaları:

❌ Başka galerilerin markalarını göremez
❌ Başka galerilerin arabalarını göremez
❌ Yeni galeri oluşturamaz
❌ Galleries menüsünü göremez
❌ Users menüsünü göremez
✅ Sadece kendi galerisine marka/araba ekleyebilir

### Super-Admin Yetkileri:

✅ Tüm galerileri yönetebilir
✅ Tüm markaları yönetebilir (herhangi bir galeriye)
✅ Tüm arabaları yönetebilir
✅ Gallery Admin atayabilir
✅ Tüm menülere erişebilir

## 📋 Örnek Senaryo

### "Otobin" Galerisi Kurulumu:

1. **Super-Admin:**
   - ✅ "Otobin" galerisini oluştur
   - ✅ "john_doe" kullanıcısını Otobin Admin yap

2. **john_doe (Otobin Admin):**
   - ✅ Toyota markası ekle → Otomatik Otobin'e ait
   - ✅ BMW markası ekle → Otomatik Otobin'e ait
   - ✅ Camry arabası ekle (Toyota) → Otobin'de
   - ❌ "AutoMax" galerisinin markalarını göremez

3. **Super-Admin:**
   - ✅ "AutoMax" galerisini oluştur
   - ✅ "jane_doe" kullanıcısını AutoMax Admin yap

4. **jane_doe (AutoMax Admin):**
   - ✅ Mercedes markası ekle → Otomatik AutoMax'e ait
   - ❌ Otobin'in Toyota markasını göremez
   - ❌ john_doe'nun arabalarını göremez

## 🗂️ Veri Yapısı

```
Gallery (Otobin)
  ├── Gallery Admin: john_doe
  ├── Brands
  │   ├── Toyota
  │   │   └── Cars: Camry, Corolla
  │   └── BMW
  │       └── Cars: 320i, X5
  └── Gallery Info (Logo, Address, Phone, Email)

Gallery (AutoMax)
  ├── Gallery Admin: jane_doe
  ├── Brands
  │   └── Mercedes
  │       └── Cars: C-Class, E-Class
  └── Gallery Info
```

## 🎨 UI Değişiklikleri

### Admin Panel Menüsü:

**Super-Admin görür:**
- 🚘 Cars
- 🏷️ Brands
- 🏢 Galleries ← **YENİ!**
- 👥 Users

**Gallery-Admin görür:**
- 🚘 Cars (sadece kendi galerisi)
- 🏷️ Brands (sadece kendi galerisi)

### Brand Ekleme Formu:

**Super-Admin için:**
- Gallery seçme dropdown'u gösterilir
- İstediği galeriye marka ekleyebilir

**Gallery-Admin için:**
- Gallery seçme dropdown'u gösterilmez
- Otomatik kendi galerisine eklenir

## 🔧 Teknik Detaylar

### Backend Changes:

✅ `Gallery.cs` entity eklendi
✅ `GalleryController.cs` oluşturuldu
✅ `BrandController.cs` - Role-based filtering
✅ `CarsController.cs` - Role-based filtering
✅ Database migration: `AddGallerySystem`

### Frontend Changes:

✅ `AdminGalleries.tsx` - Gallery yönetim sayfası
✅ `AdminBrands.tsx` - Gallery seçimi eklendi
✅ `AdminPanel.tsx` - Rol bazlı menü
✅ `galleryService.ts` - API servisi
✅ `types/index.ts` - Yeni tipler

### Database Schema:

```sql
-- Yeni Tablo
Galleries (Id, Name, Description, Address, Phone, Email, LogoUrl, ...)

-- Güncellemeler
Users.GalleryId → FK to Galleries
Brands.GalleryId → FK to Galleries
Cars → Brand → Gallery (indirect relation)
```

## 🧪 Test Adımları

1. ✅ Super-admin olarak giriş yap
2. ✅ 2 galeri oluştur ("Otobin", "AutoMax")
3. ✅ Her galeriye birer admin ata
4. ✅ Otobin admin olarak giriş yap
5. ✅ Marka ekle - sadece Otobin'e eklenir
6. ✅ AutoMax markalarını göremeyeceğini doğrula
7. ✅ AutoMax admin olarak giriş yap
8. ✅ Otobin markalarını göremeyeceğini doğrula

## 📞 Destek

Sorunlarla karşılaşırsan:

1. Backend çalışıyor mu? → `http://localhost:5000`
2. Frontend çalışıyor mu? → `http://localhost:3000`
3. Kullanıcı rolü doğru mu? → Database'de kontrol et
4. Gallery atandı mı? → Users tablosunda GalleryId kontrol et

## 🎉 Özet

✅ **Gallery sistemi hazır!**
✅ **Multi-tenancy aktif!**
✅ **Rol bazlı yetkilendirme çalışıyor!**
✅ **Super-admin ve Gallery-admin ayrımı yapılıyor!**

**Test etmeye hazırsın! 🚀**

---

**İpucu:** Farklı galeri adminleri ile giriş yaparak izolasyonu test edebilirsin.
