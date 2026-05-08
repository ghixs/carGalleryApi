import axios from 'axios';
import { Gallery, AddGalleryDto, UpdateGalleryDto, AssignGalleryAdminDto } from '../types';

const API_URL = 'http://cargalleryapi-gaou.render.com/api/Gallery';

export const galleryService = {
  getAll: async (): Promise<Gallery[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Gallery> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (gallery: AddGalleryDto): Promise<Gallery> => {
    const response = await axios.post(API_URL, gallery);
    return response.data;
  },

  update: async (gallery: UpdateGalleryDto): Promise<void> => {
    await axios.put(`${API_URL}/${gallery.id}`, gallery);
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  assignAdmin: async (data: AssignGalleryAdminDto): Promise<void> => {
    await axios.post(`${API_URL}/assign-admin`, data);
  },

  removeAdmin: async (userId: number): Promise<void> => {
    await axios.post(`${API_URL}/remove-admin/${userId}`);
  },
};
