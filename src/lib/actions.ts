'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SeatAvailability } from './definitions';

export async function updateSeat(
  programId: string,
  newCount: number
): Promise<SeatAvailability | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('seat_availability')
    .update({ available_seats: newCount, last_updated: new Date().toISOString() })
    .eq('program_id', programId)
    .select()
    .single();

  if (error) {
    console.error('Error updating seat:', error);
    return null;
  }

  revalidatePath('/seats');
  return data;
}
