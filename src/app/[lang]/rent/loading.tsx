import React from 'react';
import { RentalResultsSkeleton } from '@/modules/rental-search/ui/SearchSkeleton';

export default function RentLoading() {
  return <RentalResultsSkeleton count={4} includeSearchBar={true} />;
}
