'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { SeatAvailability } from '@/lib/definitions';
import { EditSeatModal } from './edit-seat-modal';

interface SeatsPageProps {
  initialSeats: SeatAvailability[];
}

export function SeatsPage({ initialSeats }: SeatsPageProps) {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<SeatAvailability | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEditClick = (seat: SeatAvailability) => {
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSeat(null);
  };

  const handleUpdate = (updatedSeat: SeatAvailability) => {
    setSeats(currentSeats =>
      currentSeats.map(s => (s.id === updatedSeat.id ? updatedSeat : s))
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Seat Management</CardTitle>
          <CardDescription>
            View and manage program seat availability across campuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Quota</TableHead>
                  <TableHead>Available Seats</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seats.map(seat => (
                  <TableRow key={seat.id}>
                    <TableCell className="font-medium">{seat.program}</TableCell>
                    <TableCell>{seat.campus}</TableCell>
                    <TableCell>{seat.quota}</TableCell>
                    <TableCell className="font-semibold">{seat.available}</TableCell>
                    <TableCell title={format(new Date(seat.last_updated), "PPPppp")}>
                        {formatDistanceToNow(new Date(seat.last_updated), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(seat)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Seats</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <EditSeatModal
        seat={selectedSeat}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleUpdate}
      />
    </>
  );
}
