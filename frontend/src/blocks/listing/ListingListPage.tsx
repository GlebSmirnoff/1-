import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/ui/spinner';
import ListingCard from './components/ListingCard';
import { fetchListings } from './api';

export default function ListingListPage() {
  const { data: listings = [], isLoading, isError } = useQuery(
    ['listings'],
    () => fetchListings().then(res => res.data),
    { staleTime: 1000 * 60 * 2 }
  );

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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
