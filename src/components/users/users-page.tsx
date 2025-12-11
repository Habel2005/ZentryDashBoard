'use client';

import { useState, useMemo, useEffect } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sessionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    sessions.forEach(session => {
      const phone = session.user_phone;
      if(phone) {
        counts.set(phone, (counts.get(phone) || 0) + 1);
      }
    });
    return counts;
  }, [sessions]);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.phone.toLowerCase().includes(lowerCaseSearch) ||
        (user.email && user.email.toLowerCase().includes(lowerCaseSearch))
      );
    }).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <Card>
      <CardHeader>
        <CardDescription>View and manage all registered users.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
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
                <TableHead>Joined</TableHead>
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
                    <TableCell>
                        <div>{user.phone}</div>
                        <div className="text-muted-foreground text-sm">{user.email}</div>
                    </TableCell>
                    <TableCell title={isClient ? format(new Date(user.created_at), "PPPppp") : ''}>
                        {isClient ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : ''}
                    </TableCell>
                    <TableCell className="text-center">
                      {sessionCounts.get(user.phone) || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/sessions?userPhone=${user.phone}`}>
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
      <CardFooter className="justify-end">
          <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
          />
      </CardFooter>
    </Card>
  );
}
