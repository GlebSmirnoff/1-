import api from "../../api/axios";

// Получение списка объявлений
export const fetchListings = (params?: Record<string, any>) => {
  return api.get('/listings/', { params });
};

// Получение одного объявления по ID
export const fetchListing = (id: number) => {
  return api.get(`/listings/${id}/`);
};

// Создание нового объявления
export const createListing = (data: any) => {
  return api.post('/listings/', data);
};

// Обновление объявления
export const updateListing = (id: number, data: any) => {
  return api.patch(`/listings/${id}/`, data);
};

// Удаление объявления
export const deleteListing = (id: number) => {
  return api.delete(`/listings/${id}/`);
};

export const deleteListingPhoto = (photoId: number) => {
  // должен совпадать с маршрутом в Django: DELETE /api/photos/{photo_id}/delete/
  api.delete(`/photos/${photoId}/delete/`);
};

// Загрузка фото для объявления
export const uploadPhoto = (listingId: number, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post(`/listings/${listingId}/photos/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

