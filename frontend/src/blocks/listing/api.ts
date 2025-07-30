// src/blocks/listing/api.ts
import api from '../../api/axios';

export function fetchListings() {
  return api.get('/listings/').then(res => res.data);
}
export function fetchListing(id: number) {
  return api.get(`/listings/${id}/`).then(res => res.data);
}
export function createListing(data: any) {
  return api.post('/listings/', data).then(res => res.data);
}
export function updateListing(id: number, data: any) {
  return api.patch(`/listings/${id}/`, data).then(res => res.data);
}
export function deleteListing(id: number) {
  return api.delete(`/listings/${id}/`).then(res => res.data);
}
// === Справочники ===
export const fetchBrands = () =>
  api.get('/listings/refs/brands/').then(res => res.data);
export const fetchModels = (brandId?: number) =>
  api
    .get('/listings/refs/models/', { params: brandId ? { brand: brandId } : {} })
    .then(res => res.data);
export const fetchBodyTypes = () =>
  api.get('/listings/refs/body_types/').then(res => res.data);
export const fetchEngines = () =>
  api.get('/listings/refs/engines/').then(res => res.data);
export const fetchTransmissions = () =>
  api.get('/listings/refs/transmissions/').then(res => res.data);
export const fetchFuelTypes = () =>
  api.get('/listings/refs/fuel_types/').then(res => res.data);
export const fetchDriveTypes = () =>
  api.get('/listings/refs/drive_types/').then(res => res.data);
export const fetchColors = () =>
  api.get('/listings/refs/colors/').then(res => res.data);
