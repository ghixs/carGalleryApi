export interface Brand {
  id: number;
  brandName: string;
  galleryId?: number;
  galleryName?: string;
  createdDate: string;
  updateDate?: string;
}

export interface Car {
  id: number;
  brandName: string;
  galleryName?: string;
  galleryLogoUrl?: string;
  model: string;
  year: number;
  price: number;
  imageUrl?: string;
  color?: string;
  stock: number;
  city?: string;
  imageUrls?: string[];
  createdDate: string;
  createUserId?: number;
  updateDate?: string;
  updateUserId?: number;
}

export interface Gallery {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  createdDate: string;
  brandCount: number;
  adminCount: number;
}

export interface AddBrandDto {
  brandName: string;
  galleryId?: number;
  userId?: number;
}

export interface UpdateBrandDto {
  id: number;
  brandName: string;
  userId?: number;
}

export interface AddGalleryDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface UpdateGalleryDto {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface AssignGalleryAdminDto {
  galleryId: number;
  userId: number;
}

export interface AddCarDto {
  brandId: number;
  model: string;
  year: number;
  price: number;
  createUserId: number;
  imageUrl?: string;
  color?: string;
  stock: number;
  city?: string;
}

export interface UpdateCarDto {
  id: number;
  brandId: number;
  model: string;
  year: number;
  imageUrl?: string;
  price: number;
  color?: string;
  stock: number;
  createUserId: number;
  updateUserId: number;
  city?: string;
}

export interface User {
  id: number;
  username: string;
  role: 'super-admin' | 'gallery-admin' | 'user';
  galleryId?: number;
  createdDate?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
}

export interface UpdateUserRoleDto {
  userId: number;
  role: 'super-admin' | 'gallery-admin' | 'user';
}

