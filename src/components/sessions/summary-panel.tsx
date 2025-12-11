import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Flag, Download, RefreshCw } from 'lucide-react';
import type { SessionSummary, Session } from '@/lib/definitions';
import { format } from 'date-fns';

interface SummaryPanelProps {
  summary: SessionSummary | undefined;
  session: Session | undefined;
}

export function SummaryPanel({ summary, session }: SummaryPanelProps) {
    if (!session) return null;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Session Summary</CardTitle>
        <CardDescription>AI-generated overview of the conversation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary ? (
          <>
            <p className="text-sm text-muted-foreground">{summary.summary}</p>
            <Separator />
            <div className="space-y-2 text-sm">
                <MetadataRow label="Model" value={summary.model} />
                <MetadataRow label="Tokens Used" value={summary.tokens.toString()} />
                <MetadataRow label="Summary Date" value={format(new Date(summary.created_at), "MMM d, yyyy 'at' h:mm a")} />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">No summary available for this session.</p>
        )}
        <Separator />
        <div className="space-y-2 text-sm">
            <MetadataRow label="Session Start" value={format(new Date(session.start_time), "MMM d, yyyy 'at' h:mm a")} />
            {session.end_time && <MetadataRow label="Session End" value={format(new Date(session.end_time), "MMM d, yyyy 'at' h:mm a")} />}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="w-full"><Flag className="mr-2 h-4 w-4" /> Flag Session</Button>
        <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" /> Export</Button>
        <Button className="w-full"><RefreshCw className="mr-2 h-4 w-4" /> Re-run Summary</Button>
      </CardFooter>
    </Card>
  );
}

function MetadataRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-right">{value}</span>
        </div>
    );
}
