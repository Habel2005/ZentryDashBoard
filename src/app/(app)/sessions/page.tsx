import { fetchSessions, fetchUsers } from '@/lib/api';
import { SessionsPage } from '@/components/sessions/sessions-page';

// TODO: Supabase - Replace fetch calls with Supabase client queries.
export default async function SessionsListPage() {
  const sessions = await fetchSessions();
  const users = await fetchUsers();
  
  return (
    <div className="space-y-8">
      <SessionsPage sessions={sessions} users={users} />
    </div>
  );
}
