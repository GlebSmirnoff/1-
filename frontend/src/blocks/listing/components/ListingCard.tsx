// src/blocks/listing/components/ListingCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Listing } from '@/shared/types/listing';
import { Link } from 'react-router-dom';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => (
  <Card className="rounded-2xl shadow p-2 hover:shadow-lg transition">
    <Link to={`/listings/${listing.id}`} className="block">
      <img
        src={listing.photos[0]?.image}
        alt={`${listing.brand.name} ${listing.model.name}`}
        className="w-full h-48 object-cover rounded-2xl mb-2"
      />
      <CardContent>
        <h3 className="text-xl font-semibold truncate">
          {listing.brand.name} {listing.model.name}
        </h3>
        <p className="text-gray-600 text-sm">
          {listing.year} • {listing.mileage.toLocaleString()} km
        </p>
        <p className="text-lg font-bold mt-1">
          {listing.price.toLocaleString()} {listing.currency}
        </p>
      </CardContent>
    </Link>
  </Card>
);

export default ListingCard;
