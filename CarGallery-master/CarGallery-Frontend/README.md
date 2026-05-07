# Car Gallery Frontend

Modern bir React + TypeScript frontend uygulaması.

## Özellikler

- 🔐 **Kimlik Doğrulama**: Login ve Register sayfaları
- 👨‍💼 **Admin Paneli**: Araba ve marka yönetimi için CRUD işlemleri
- 🚗 **Katalog**: Filtreleme ve arama özellikli araba listesi
- 🎨 **Modern UI**: Responsive tasarım ve animasyonlar
- ⚡ **Hızlı Geliştirme**: Vite ile instant hot reload

## Teknolojiler

- React 18
- TypeScript
- React Router v6
- Zustand (State Management)
- Axios
- Vite

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## Kullanım

### Demo Hesaplar

- **Admin**: `admin` / `admin`
- **Kullanıcı**: Herhangi bir kullanıcı adı ve şifre

### Özellikler

#### Kullanıcı Özellikleri
- Araba kataloğunu görüntüleme
- Markaya göre filtreleme
- Arama yapabilme
- Yıl veya fiyata göre sıralama

#### Admin Özellikleri
- Araba ekleme, düzenleme, silme
- Marka ekleme, düzenleme, silme
- Tüm CRUD işlemleri

## API Endpoint'leri

Backend API varsayılan olarak `http://localhost:5000` adresinde çalışmalıdır.

### Arabalar
- `GET /api/Cars/Get All` - Tüm arabaları listele
- `POST /api/Cars/Post` - Yeni araba ekle
- `PUT /api/Cars/Update` - Araba güncelle
- `DELETE /api/Cars/Delete?id={id}` - Araba sil

### Markalar
- `GET /api/Brand/GetAll` - Tüm markaları listele
- `POST /api/Brand/Post` - Yeni marka ekle
- `PUT /api/Brand/Update` - Marka güncelle
- `DELETE /api/Brand/Delete?id={id}` - Marka sil

## Proje Yapısı

```
src/
├── components/      # Reusable components
├── pages/          # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Catalog.tsx
│   ├── AdminPanel.tsx
│   ├── AdminCars.tsx
│   └── AdminBrands.tsx
├── services/       # API services
│   ├── api.ts
│   ├── carService.ts
│   └── brandService.ts
├── store/          # Zustand stores
│   └── authStore.ts
├── types/          # TypeScript types
│   └── index.ts
├── styles/         # Global styles
│   └── global.css
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Geliştirme

Proje Vite ile geliştirilmiştir ve hot module replacement (HMR) destekler.

Port: `3000` (varsayılan)

## Lisans

MIT
