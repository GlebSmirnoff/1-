// файл: src/blocks/listing/ListingListPage.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/ui/spinner';
import { fetchListings } from './api';

interface Listing {
  id: number;
  title: string;
  price: number;
  currency: string;
  year: number;
  mileage: number;
  // при необходимости дополняйте поля...
}

export default function ListingListPage() {
  const { data, isLoading, isError } = useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: fetchListings,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }
  if (isError) {
    return <div className="text-red-600">Ошибка загрузки объявлений.</div>;
  }

  const listings = data || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Year</th>
            <th className="px-4 py-2 text-left">Mileage</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="px-4 py-2">{l.id}</td>
              <td className="px-4 py-2">{l.title || '—'}</td>
              <td className="px-4 py-2">
                {l.price} {l.currency}
              </td>
              <td className="px-4 py-2">{l.year}</td>
              <td className="px-4 py-2">{l.mileage.toLocaleString()} km</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}