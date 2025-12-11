'use client';

import { useState, useMemo } from 'react';
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
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageSquare } from 'lucide-react';
import type { User, Session } from '@/lib/definitions';
import { format, formatDistanceToNow } from 'date-fns';
import { PaginationControls } from '../shared/pagination-controls';

interface UsersPageProps {
  users: User[];
  sessions: Session[];
}

const USERS_PER_PAGE = 8;

export function UsersPage({ users, sessions }: UsersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const sessionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    sessions.forEach(session => {
      counts.set(session.userId, (counts.get(session.userId) || 0) + 1);
    });
    return counts;
  }, [sessions]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.phone.toLowerCase().includes(lowerCaseSearch)
      );
    }).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all registered users.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Total Sessions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell title={format(new Date(user.last_seen), "PPPppp")}>
                        {formatDistanceToNow(new Date(user.last_seen), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-center">
                      {sessionCounts.get(user.id) || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/sessions?userId=${user.id}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Sessions
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
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
