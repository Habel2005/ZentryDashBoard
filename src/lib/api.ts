import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type {
  User,
  Session,
  SessionMessage,
  SessionSummary,
  SeatAvailability
} from './definitions';

/**
 * Helper: compute duration string for completed sessions
 */
function computeDuration(session: Session): Session {
  try {
    if (session.status === 'completed' && session.start_time && session.end_time) {
      const start = new Date(session.start_time).getTime();
      const end = new Date(session.end_time).getTime();
      const durationMs = Math.max(0, end - start);
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      return { ...session, duration: `${minutes}m ${seconds}s` } as Session;
    }
  } catch (err) {
    // ignore and return original
  }
  return session;
}

/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
  return (data ?? []) as User[];
}

/**
 * Fetch sessions and attach matching user (by phone).
 * This respects the current DB schema which uses `user_phone` in sessions
 * and `phone` in users.
 */
export async function fetchSessions(): Promise<(Session & { user?: Partial<User> })[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw new Error('Failed to fetch sessions');
  }

  const sessions = (data ?? []) as Session[];

  // collect phones referenced by sessions
  const phones = Array.from(new Set(sessions.map(s => s.user_phone).filter(Boolean)));

  let usersMap: Record<string, User> = {};
  if (phones.length > 0) {
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('phone', phones);

    if (usersError) {
      console.warn('Warning: failed to fetch users for mapping by phone', usersError);
    } else if (usersData) {
      usersMap = (usersData as User[]).reduce((acc, u) => {
        if (u.phone) acc[u.phone] = u;
        return acc;
      }, {} as Record<string, User>);
    }
  }

  // attach user (if available) and compute duration
  return sessions.map(s => {
    const mapped = computeDuration(s);
    return {
      ...mapped,
      user: mapped.user_id ? undefined : usersMap[mapped.user_phone ?? ''] // prefer phone mapping; keep user_id undefined if null
    };
  });
}

/**
 * Fetch recent sessions (for dashboard) — default last N items
 */
export async function fetchRecentSessions(limit = 5): Promise<Session[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('start_time', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent sessions:', error);
    return [];
  }

  const sessions = (data ?? []) as Session[];
  const phones = Array.from(new Set(sessions.map(s => s.user_phone).filter(Boolean)));
  let usersMap: Record<string, User> = {};

  if (phones.length > 0) {
    const { data: usersData } = await supabase.from('users').select('*').in('phone', phones);
    if (usersData) {
      usersMap = (usersData as User[]).reduce((acc, u) => {
        if (u.phone) acc[u.phone] = u;
        return acc;
      }, {} as Record<string, User>);
    }
  }

  return sessions.map(s => ({
    ...computeDuration(s),
    user: usersMap[s.user_phone ?? '']
  }));
}

/**
 * Fetch sessions by user's PHONE (used by "View Sessions" in Users page)
 */
export async function fetchSessionsByUserPhone(userPhone: string): Promise<(Session & { user?: Partial<User> })[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_phone', userPhone)
    .order('start_time', { ascending: false });

  if (error) {
    console.error(`Error fetching sessions for user phone ${userPhone}:`, error);
    return [];
  }

  const sessions = (data ?? []) as Session[];

  // fetch the user once to attach
  const { data: usersData } = await supabase.from('users').select('*').eq('phone', userPhone).limit(1);
  const user = (usersData && usersData[0]) as User | undefined;

  return sessions.map(s => ({
    ...computeDuration(s),
    user
  }));
}

/**
 * Fetch a single session by ID (and attach user info by phone if present)
 */
export async function fetchSessionById(sessionId: string): Promise<(Session & { user?: Partial<User> }) | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error(`Error fetching session ${sessionId}:`, error);
    return undefined;
  }
  const session = data as Session;
  const mapped = computeDuration(session);

  if (mapped.user_phone) {
    const { data: usersData } = await supabase.from('users').select('*').eq('phone', mapped.user_phone).limit(1);
    const user = usersData && usersData[0];
    return { ...mapped, user };
  }
  return mapped;
}

/**
 * Fetch messages for session (paginated)
 */
export async function fetchSessionMessages(
  sessionId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<SessionMessage[]> {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;

  const { data, error } = await supabase
    .from('session_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error);
    return [];
  }
  return (data ?? []) as SessionMessage[];
}

/**
 * Fetch session summary
 */
export async function fetchSessionSummary(sessionId: string): Promise<SessionSummary | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('session_summaries')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    // Gracefully handle case where summary doesn't exist, which is not an error
    if (error.code === 'PGRST116') { // "PostgREST error 116: 'JSON object requested, but row not found'"
        return undefined;
    }
    console.error(`Error fetching summary for session ${sessionId}:`, error);
    return undefined;
  }
  return data as SessionSummary;
}


/**
 * Seats
 */
export async function fetchSeatAvailability(): Promise<SeatAvailability[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('seat_availability').select('*');
  if (error) {
    console.error('Error fetching seat availability:', error);
    return [];
  }
  return (data ?? []) as SeatAvailability[];
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