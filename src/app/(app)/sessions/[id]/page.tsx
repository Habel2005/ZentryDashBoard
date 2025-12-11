import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSession, fetchSessionMessages, fetchSessionSummary, fetchUsers } from '@/lib/api';
import { TranscriptViewer } from '@/components/sessions/transcript-viewer';
import { SummaryPanel } from '@/components/sessions/summary-panel';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: { id: string };
}

// TODO: Supabase - Replace fetch calls with Supabase client queries.
export default async function SessionDetailPage({ params }: PageProps) {
  const [session, messages, summary, users] = await Promise.all([
    fetchSession(params.id),
    fetchSessionMessages(params.id),
    fetchSessionSummary(params.id),
    fetchUsers()
  ]);

  if (!session) {
    notFound();
  }

  const user = users.find(u => u.id === session.userId);

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/sessions">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Sessions</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Session Details</h1>
            <p className="text-muted-foreground text-sm">Session ID: <span className="font-mono">{session.id}</span></p>
            {user && <p className="text-muted-foreground text-sm">User: {user.name} ({user.phone})</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TranscriptViewer messages={messages} />
        </div>
        <div className="lg:col-span-1">
          <SummaryPanel summary={summary} session={session} />
        </div>
      </div>
    </div>
  );
}
