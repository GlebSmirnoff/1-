// src/blocks/listing/ListingListPage.tsx
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useListings } from './api';
import ListingCard from './components/ListingCard';


const ListingListPage: React.FC = () => {
  const {
    data: listings = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useListings();

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Помилка завантаження: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Оголошення {isFetching && <span className="text-sm opacity-50">(оновлюється…)</span>}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </ul>
    </div>
  );
};

export default ListingListPage;