import { fetchRecentSessions, fetchUsers, fetchSessions } from '@/lib/api';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RecentSessions } from '@/components/dashboard/recent-sessions';
import { Users, MessageSquare, Hourglass, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const users = await fetchUsers();
  const allSessions = await fetchSessions();
  const recentSessions = await fetchRecentSessions();

  const totalUsers = users.length;
  const totalSessions = allSessions.length;
  const activeSessions = allSessions.filter(s => s.status === 'active').length;
  const completedSessions = allSessions.filter(s => s.status === 'completed').length;

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
        <RecentSessions sessions={recentSessions} />
      </div>
    </div>
  );
}
