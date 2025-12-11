'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session, User } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';
import { PaginationControls } from '../shared/pagination-controls';

interface SessionsPageProps {
  sessions: Session[];
  users: User[];
}

const SESSIONS_PER_PAGE = 8;

export function SessionsPage({ sessions, users }: SessionsPageProps) {
  const searchParams = useSearchParams();
  const userPhoneQuery = searchParams.get('userPhone');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (userPhoneQuery) {
      setSearchTerm(userPhoneQuery);
    }
  }, [userPhoneQuery]);

  const userMap = useMemo(() => new Map(users.map(user => [user.phone, user])), [users]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter(session => {
        const user = userMap.get(session.user_phone);
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        const matchesSearch = session.user_phone.toLowerCase().includes(lowerCaseSearch) || session.id.toLowerCase().includes(lowerCaseSearch) || user?.name.toLowerCase().includes(lowerCaseSearch);
        const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  }, [sessions, searchTerm, statusFilter, userMap]);

  const totalPages = Math.ceil(filteredSessions.length / SESSIONS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * SESSIONS_PER_PAGE,
    currentPage * SESSIONS_PER_PAGE
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
        <CardDescription>Browse, search, and view user sessions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Session ID, User Name, or Phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.length > 0 ? (
                paginatedSessions.map(session => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-xs">{session.id}</TableCell>
                    <TableCell>{userMap.get(session.user_phone)?.name || session.user_phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn('capitalize', {
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100/80': session.status === 'completed',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100/80': session.status === 'active',
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100/80': session.status === 'failed',
                        })}
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                    </TableCell>
                    <TableCell>{session.duration || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/sessions/${session.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Session</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
}
