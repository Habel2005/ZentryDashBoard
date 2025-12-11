export type User = {
  id: string; // Assuming UUID from Supabase
  phone: string;
  name: string;
  email: string | null;
  created_at: string;
  last_seen: string;
};

export type Session = {
  id: string; // UUID
  user_phone: string;
  channel: string;
  status: 'active' | 'completed' | 'failed';
  start_time: string;
  end_time: string | null;
  meta: Record<string, any> | null;
  user_id: string | null;
};

export type SessionMessage = {
  id: number; // biginc
  session_id: string;
  sender: 'user' | 'agent';
  text: string;
  tokens: number | null;
  created_at: string;
  tool_used?: string; // This might come from meta or be a separate field
};

export type SessionSummary = {
  id: number; // biginc
  session_id: string;
  summary_text: string;
  summary_type: string;
  model_meta: Record<string, any> | null;
  created_at: string;
};

export type SeatAvailability = {
  program_id: string;
  program_name: string;
  campus: string;
  quota_type: string;
  available_seats: number;
  last_updated: string; // timestamptz
};
