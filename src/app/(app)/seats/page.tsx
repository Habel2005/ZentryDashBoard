import { fetchSeatAvailability } from '@/lib/api';
import { SeatsPage } from '@/components/seats/seats-page';

export default async function SeatManagementPage() {
  const seats = await fetchSeatAvailability();

  return (
    <div className="space-y-8">
      <SeatsPage initialSeats={seats} />
    </div>
  );
}
