// Auto-generated TypeScript interfaces for Listing app

export interface BodyType {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface DriveType {
  id: number;
  name: string;
}

export interface Engine {
  id: number;
  name: string;
  horsepower?: number;
  volume_l?: number;
}

export interface FuelType {
  id: number;
  name: string;
}

export interface Transmission {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  name: string;
  brand: Brand;
}

export interface ListingPhoto {
  id: number;
  image: string; // URL
  is_main: boolean;
  order: number;
}

export type ModerationStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type Currency = 'UAH' | 'USD';
export type PromotedType = 'top' | 'highlight' | 'vip';

export interface Listing {
  id: number;
  created_at: string;
  updated_at: string;
  vin?: string;
  owners_count: number;
  price: number;
  currency: Currency;
  is_reserved: boolean;
  is_sold: boolean;
  year: number;
  mileage: number;
  slug: string;

  // Relations
  brand: Brand;
  model: Model;
  body_type?: BodyType;
  color?: Color;
  drive_type: DriveType;
  engine?: Engine;
  fuel_type: FuelType;
  transmission?: Transmission;
  photos: ListingPhoto[];

  // Moderation & Promotion
  moderation_reason?: string;
  moderation_status: ModerationStatus;
  is_promoted: boolean;
  promoted_type?: PromotedType;
  promoted_until?: string;
}

export interface Favorite {
  id: number;
  added_at: string;
  listing: Listing;
  user: number; // User ID
}
