import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSessionById, fetchSessionMessages, fetchSessionSummary } from '@/lib/api';
import { TranscriptViewer } from '@/components/sessions/transcript-viewer';
import { SummaryPanel } from '@/components/sessions/summary-panel';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: { id: string };
}

export default async function SessionDetailPage({ params }: PageProps) {
  const [session, messages, summary] = await Promise.all([
    fetchSessionById(params.id),
    fetchSessionMessages(params.id),
    fetchSessionSummary(params.id),
  ]);

  if (!session) {
    notFound();
  }

  const user = session.user;

  return (
    <div className="space-y-6">
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
