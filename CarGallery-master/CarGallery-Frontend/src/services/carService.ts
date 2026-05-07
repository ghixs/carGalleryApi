import api from './api';
import { Car, AddCarDto, UpdateCarDto } from '../types';

export const carService = {
  getAll: async (userId?: number): Promise<Car[]> => {
    const params = userId ? { userId } : {};
    const response = await api.get('/Cars/Get All', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Car> => {
    const response = await api.get(`/Cars/Get by id?id=${id}`);
    return response.data;
  },

  create: async (data: AddCarDto): Promise<Car> => {
    const response = await api.post('/Cars/Post', data);
    return response.data;
  },

  update: async (data: UpdateCarDto): Promise<void> => {
    await api.put('/Cars/Update', data);
  },

  updateImages: async (id: number, imageUrls: string[], userId?: number): Promise<void> => {
    const params = userId ? { userId } : {};
    await api.put(`/Cars/UpdateImages/${id}`, imageUrls, { params });
  },

  delete: async (id: number, userId?: number): Promise<void> => {
    const params = userId ? { userId } : {};
    await api.delete(`/Cars/Delete?id=${id}`, { params });
  },
};
