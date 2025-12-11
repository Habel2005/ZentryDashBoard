import {
  User,
  Session,
  SessionMessage,
  SessionSummary,
  SeatAvailability,
} from './definitions';
import users from './data/users.json';
import sessions from './data/sessions.json';
import sessionMessages from './data/session_messages.json';
import sessionSummaries from './data/session_summaries.json';
import seatAvailability from './data/seat_availability.json';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// TODO: Supabase - Replace these mock API calls with actual Supabase client queries.

export async function fetchUsers(): Promise<User[]> {
  await delay(200);
  return users as User[];
}

export async function fetchSessions(): Promise<Session[]> {
  await delay(200);
  return sessions as Session[];
}

export async function fetchSession(id: string): Promise<Session | undefined> {
  await delay(200);
  return (sessions as Session[]).find(s => s.id === id);
}

export async function fetchSessionMessages(sessionId: string): Promise<SessionMessage[]> {
  await delay(200);
  return (sessionMessages as SessionMessage[]).filter(m => m.session_id === sessionId);
}

export async function fetchSessionSummary(sessionId: string): Promise<SessionSummary | undefined> {
  await delay(200);
  return (sessionSummaries as SessionSummary[]).find(s => s.session_id === sessionId);
}

export async function fetchSeatAvailability(): Promise<SeatAvailability[]> {
  await delay(200);
  return seatAvailability as SeatAvailability[];
}

// This is a mock function. In a real app, this would be a server action
// updating the database and revalidating the path.
export async function updateSeat(programId: string, newCount: number): Promise<SeatAvailability | undefined> {
  await delay(500);
  // This is a client-side mock update. It does not persist.
  const seatToUpdate = seatAvailability.find(s => s.id === programId);
  if (seatToUpdate) {
    seatToUpdate.available = newCount;
    seatToUpdate.last_updated = new Date().toISOString();
    return seatToUpdate;
  }
  return undefined;
}
