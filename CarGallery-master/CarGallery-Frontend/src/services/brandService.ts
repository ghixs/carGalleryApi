import api from './api';
import { Brand, AddBrandDto, UpdateBrandDto } from '../types';

export const brandService = {
  getAll: async (userId?: number): Promise<Brand[]> => {
    const params = userId ? { userId } : {};
    const response = await api.get('/Brand/GetAll', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Brand> => {
    const response = await api.get(`/Brand/Get by id?id=${id}`);
    return response.data;
  },

  create: async (data: AddBrandDto): Promise<Brand> => {
    const response = await api.post('/Brand/Post', data);
    return response.data;
  },

  update: async (data: UpdateBrandDto): Promise<Brand> => {
    const response = await api.put('/Brand/Update', data);
    return response.data;
  },

  delete: async (id: number, userId?: number): Promise<void> => {
    const params = userId ? { userId } : {};
    await api.delete(`/Brand/Delete?id=${id}`, { params });
  },
};
