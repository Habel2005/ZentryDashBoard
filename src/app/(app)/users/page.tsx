import { fetchUsers, fetchSessions } from '@/lib/api';
import { UsersPage } from '@/components/users/users-page';

// TODO: Supabase - Replace fetch calls with Supabase client queries.
export default async function UserManagementPage() {
  const users = await fetchUsers();
  const sessions = await fetchSessions();

  return (
    <div className="space-y-8">
      <UsersPage users={users} sessions={sessions} />
    </div>
  );
}
