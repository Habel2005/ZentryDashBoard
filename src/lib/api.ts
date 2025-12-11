import 'server-only';
import { createClient } from '@/lib/supabase/server';
import {
  User,
  Session,
  SessionMessage,
  SessionSummary,
  SeatAvailability,
} from './definitions';

// The new API uses Supabase directly.
// The functions below are examples of how you might query your database.
// You will need to adjust them to fit your actual schema and requirements.

export async function fetchUsers(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  // The 'users' table might not have 'last_seen', so we add a default value.
  // This depends on your actual schema.
  return data.map(user => ({ ...user, last_seen: user.last_seen || new Date().toISOString() }));
}

export async function fetchSessions(): Promise<Session[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('sessions').select('*').order('start_time', { ascending: false });
  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  return data;
}

export async function fetchSession(id: string): Promise<Session | undefined> {
    const supabase = createClient();
    const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching session:', error);
        return undefined;
    }
    return data || undefined;
}


export async function fetchSessionMessages(sessionId: string): Promise<SessionMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('session_messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching session messages:', error);
    return [];
  }
  return data;
}

export async function fetchSessionSummary(sessionId: string): Promise<SessionSummary | undefined> {
    const supabase = createClient();
    const { data, error } = await supabase.from('session_summaries').select('*').eq('session_id', sessionId).maybeSingle();
    if (error) {
        console.error('Error fetching session summary:', error);
        return undefined;
    }
    return data || undefined;
}

export async function fetchSeatAvailability(): Promise<SeatAvailability[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('seat_availability').select('*').order('program_name');
  if (error) {
    console.error('Error fetching seat availability:', error);
    return [];
  }
  return data;
}

export async function updateSeat(programId: string, newCount: number): Promise<SeatAvailability | null> {
  'use server'
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
  
  return data;
}
