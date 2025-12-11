export type User = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  last_seen: string;
};

export type Session = {
  id: string;
  userId: string;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'completed' | 'failed';
};

export type SessionMessage = {
  id: string;
  session_id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  tokens?: number;
  tool_used?: string;
};

export type SessionSummary = {
  id: string;
  session_id: string;
  summary: string;
  model: string;
  tokens: number;
  created_at: string;
};

export type SeatAvailability = {
  id: string;
  program: string;
  campus: string;
  quota: number;
  available: number;
  last_updated: string;
};
