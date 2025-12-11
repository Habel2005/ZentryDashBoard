'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

const breadcrumbNameMap: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/sessions': 'Sessions',
  '/users': 'Users',
  '/seats': 'Seats',
  '/settings': 'Settings',
};

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const name = breadcrumbNameMap[href] || capitalize(segment);
    const isLast = index === pathSegments.length - 1;
    return { href, name, isLast };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {pathname !== '/dashboard' && (
             <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-lg font-medium">
                    Dashboard
                </Link>
            </li>
        )}
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            {(index > 0 || pathname !== '/dashboard') && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <li>
                {crumb.isLast ? (
                    <span className="font-semibold text-foreground text-lg">{crumb.name}</span>
                ) : (
                    <Link href={crumb.href} className="text-muted-foreground hover:text-primary transition-colors text-lg font-medium">
                    {crumb.name}
                    </Link>
                )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
