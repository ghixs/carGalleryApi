# Car Gallery - Tam Stack Uygulama

Bu proje bir araba galerisi yönetim sistemidir. ASP.NET Core backend ve React + TypeScript frontend içerir.

## 📁 Proje Yapısı

```
CarGallery-master/
├── CarGallery/              # ASP.NET Core Backend
│   ├── Controllers/         # API Controllers
│   ├── Data/               # Database Context
│   ├── Entities/           # Entity Models
│   ├── DTOs/               # Data Transfer Objects
│   └── Migrations/         # EF Core Migrations
│
└── CarGallery-Frontend/    # React + TypeScript Frontend
    ├── src/
    │   ├── pages/          # Page Components
    │   ├── services/       # API Services
    │   ├── store/          # State Management
    │   ├── types/          # TypeScript Types
    │   └── styles/         # CSS Styles
    └── public/
```

## 🚀 Başlangıç

### Gereksinimler

- .NET 8 SDK
- Node.js (v18 veya üzeri)
- PostgreSQL

### Backend Kurulumu

```bash
cd CarGallery

# Veritabanı bağlantısını ayarlayın (appsettings.json)
# Migration'ları uygulayın
dotnet ef database update

# Uygulamayı başlatın
dotnet run
```

Backend varsayılan olarak `http://localhost:5000` adresinde çalışır.

### Frontend Kurulumu

```bash
cd CarGallery-Frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışır.

### Hızlı Başlatma (macOS/Linux)

```bash
# Frontend'i başlatmak için
chmod +x start-frontend.sh
./start-frontend.sh
```

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ Kullanıcı kaydı ve girişi (ilk kayıt olan otomatik admin olur)
- 🚗 Araba katalogunu görüntüleme
- 🔍 Arama ve filtreleme
- 📊 Sıralama (yıl, fiyat)

### Admin Özellikleri
- 👨‍💼 Admin paneli erişimi
- ➕ Araba ekleme, düzenleme, silme
- 🏷️ Marka ekleme, düzenleme, silme
- 👥 Kullanıcı yönetimi (diğer kullanıcıları admin yapma)
- 📋 Tüm CRUD işlemleri

## 🔐 Demo Hesaplar

**Önemli:** İlk kayıt olan kullanıcı otomatik olarak **admin** olur!

1. İlk kullanıcıyı kaydedin (admin olacak)
2. Admin kullanıcı, admin panelden diğer kullanıcıları admin yapabilir
3. Sonraki kayıtlar normal kullanıcı olarak başlar

## 🛠️ Teknolojiler

### Backend
- ASP.NET Core 8
- Entity Framework Core
- PostgreSQL
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- React Router v6
- Zustand (State Management)
- Axios
- Vite

## 📡 API Endpoints

### Authentication & Users
- `POST /api/Auth/register` - Yeni kullanıcı kaydı (ilk kullanıcı admin olur)
- `POST /api/Auth/login` - Kullanıcı girişi
- `GET /api/Auth/users` - Tüm kullanıcıları listele (Admin)
- `PUT /api/Auth/users/role` - Kullanıcı rolünü güncelle (Admin)
- `DELETE /api/Auth/users/{id}` - Kullanıcı sil (Admin)

### Cars
- `GET /api/Cars/Get All` - Tüm arabaları listele
- `GET /api/Cars/Get by id?id={id}` - ID'ye göre araba getir
- `POST /api/Cars/Post` - Yeni araba ekle
- `PUT /api/Cars/Update` - Araba güncelle
- `DELETE /api/Cars/Delete?id={id}` - Araba sil

### Brands
- `GET /api/Brand/GetAll` - Tüm markaları listele
- `GET /api/Brand/Get by id?id={id}` - ID'ye göre marka getir
- `POST /api/Brand/Post` - Yeni marka ekle
- `PUT /api/Brand/Update` - Marka güncelle
- `DELETE /api/Brand/Delete?id={id}` - Marka sil

## 📸 Ekran Görüntüleri

### Ana Katalog Sayfası
- Modern ve responsive tasarım
- Filtreleme ve arama özellikleri
- Kart tabanlı görünüm

### Admin Paneli
- Kolay kullanımlı CRUD arayüzü
- Tablo görünümü
- Inline düzenleme

### Login/Register
- Temiz ve modern tasarım
- Form validasyonu
- Demo hesap bilgileri

## 🔧 Yapılandırma

### Backend CORS Ayarları
Ba**İlk kullanıcı sistemi**: İlk kayıt olan kullanıcı otomatik admin olur
- Admin kullanıcılar, admin panelden diğer kullanıcıları admin yapabilir
- Kullanıcı şifreleri SHA256 ile hash'lenir
- İlk admin kullanıcı silinemez
- Kullanıcılar kendi hesaplarını silemez veya kendi rollerini değiştiremez
Frontend, Vite proxy kullanarak `/api` isteklerini `http://localhost:5000`'e yönlendirir. Farklı bir backend URL kullanıyorsanız [vite.config.ts](CarGallery-Frontend/vite.config.ts) dosyasını güncelleyin.

## 📝 Notlar

- Bu proje eğitim amaçlıdır
- Kimlik doğrulama sistemi basitleştirilmiştir (production için JWT veya başka bir sistem kullanılmalıdır)
- Resim yükleme özelliği henüz eklenmemiştir

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

Bu proje GitHub Copilot tarafından oluşturulmuştur.
