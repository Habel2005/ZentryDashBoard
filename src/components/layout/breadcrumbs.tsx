'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const breadcrumbNameMap: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/sessions': 'Sessions',
  '/users': 'Users',
  '/seats': 'Seats',
  '/settings': 'Settings',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <nav aria-label="Breadcrumb" className="text-sm font-medium text-muted-foreground">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
        </li>
        {pathSegments.slice(1).map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 2).join('/')}`;
          const name = breadcrumbNameMap[href] || segment.charAt(0).toUpperCase() + segment.slice(1);
          const isLast = index === pathSegments.length - 2;

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4" />
              {isLast ? (
                <span className="text-foreground">{name}</span>
              ) : (
                <Link href={href} className="hover:text-primary transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
