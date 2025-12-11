import { fetchSessions, fetchUsers } from '@/lib/api';
import { SessionsPage } from '@/components/sessions/sessions-page';
import { Suspense } from 'react';

function SessionsPageContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionsPageLoader />
    </Suspense>
  )
}


async function SessionsPageLoader() {
  const sessions = await fetchSessions();
  const users = await fetchUsers();
  
  return (
    <div className="space-y-8">
      <SessionsPage sessions={sessions} users={users} />
    </div>
  );
}

export default SessionsPageContent;
