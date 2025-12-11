'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session, User } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';

interface RecentSessionsProps {
  sessions: Session[];
  users: User[];
}

export function RecentSessions({ sessions, users }: RecentSessionsProps) {
  const userMap = new Map(users.map(user => [user.phone, user]));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>An overview of the most recent user sessions.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/sessions">
                View All
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Start Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.slice(0, 5).map(session => {
              const user = userMap.get(session.user_phone);
              return (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="font-medium">{user?.name || 'Unknown User'}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {session.user_phone}
                  </div>
                </TableCell>
                <TableCell>
                   <Badge
                    className={cn({
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100/80': session.status === 'completed',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100/80': session.status === 'active',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100/80': session.status === 'failed',
                    })}
                   >
                    {session.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
