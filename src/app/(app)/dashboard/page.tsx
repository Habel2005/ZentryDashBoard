import { fetchSessions, fetchUsers } from '@/lib/api';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RecentSessions } from '@/components/dashboard/recent-sessions';
import { Users, MessageSquare, Hourglass, CheckCircle } from 'lucide-react';

// TODO: Supabase - Replace fetch calls with Supabase client queries.
export default async function DashboardPage() {
  const users = await fetchUsers();
  const sessions = await fetchSessions();

  const totalUsers = users.length;
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value={totalUsers} icon={Users} />
        <KpiCard title="Total Sessions" value={totalSessions} icon={MessageSquare} />
        <KpiCard title="Active Sessions" value={activeSessions} icon={Hourglass} description="Users currently in a session"/>
        <KpiCard title="Completed Sessions" value={completedSessions} icon={CheckCircle} description="Past 24 hours"/>
      </div>

      <div>
        <RecentSessions sessions={sessions} users={users} />
      </div>
    </div>
  );
}
