'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { SeatAvailability } from '@/lib/definitions';
import { updateSeat } from '@/lib/api';

interface EditSeatModalProps {
  seat: SeatAvailability | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSeat: SeatAvailability) => void;
}

export function EditSeatModal({ seat, isOpen, onClose, onUpdate }: EditSeatModalProps) {
  const [availableSeats, setAvailableSeats] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  if (!seat) return null;

  const handleSave = async () => {
    const newCount = Number(availableSeats);
    if (isNaN(newCount) || newCount < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid non-negative number for available seats.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // TODO: Supabase - Replace with a server action calling Supabase
    try {
        const updatedSeat = await updateSeat(seat.id, newCount);
        if (updatedSeat) {
            onUpdate(updatedSeat);
            toast({
                title: "Success",
                description: "Seat availability has been updated.",
            });
            onClose();
        } else {
            throw new Error("Failed to update seat.")
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "Could not update seat availability. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Seat Availability</DialogTitle>
          <DialogDescription>
            Update the number of available seats for {seat.program} at {seat.campus}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="available-seats" className="text-right">
              Available Seats
            </Label>
            <Input
              id="available-seats"
              type="number"
              defaultValue={seat.available}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Quota
            </Label>
            <p className="col-span-3 text-sm text-muted-foreground">{seat.quota}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
