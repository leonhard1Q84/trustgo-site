import { Skeleton } from '@/shared/ui/skeleton';

export default function ManageBookingLoading() {
  return (
    <div className="mx-auto max-w-default space-y-6 px-4 py-8 md:px-8 lg:px-10" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-11 w-64" />
      <Skeleton className="h-48 rounded-card" />
    </div>
  );
}
