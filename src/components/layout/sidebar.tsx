'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Armchair,
  Settings,
  X,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Dispatch, SetStateAction } from 'react';

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/sessions', icon: MessageSquare, label: 'Sessions' },
  { href: '/users', icon: Users, label: 'Users' },
  { href: '/seats', icon: Armchair, label: 'Seats' },
];

const settingsNavItem = { href: '/settings', icon: Settings, label: 'Settings' };


interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  isCollapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

function NavItem({ item, isCollapsed, setMobileOpen }: { item: typeof mainNavItems[0], isCollapsed: boolean, setMobileOpen: (isOpen: boolean) => void }) {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

    const linkContent = (
        <>
            <item.icon className="h-5 w-5 shrink-0" />
            <span className={cn('overflow-hidden transition-all duration-300', isCollapsed ? 'w-0' : 'w-auto ml-3')}>
                {item.label}
            </span>
            <span className="sr-only">{item.label}</span>
        </>
    )

    const commonClasses = cn(
        'flex items-center rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
        isActive && 'bg-primary/10 text-primary',
        isCollapsed ? 'justify-center' : 'justify-start'
    );
    
    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={commonClasses}
                    >
                        {linkContent}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                    {item.label}
                </TooltipContent>
            </Tooltip>
        );
    }
    
    return (
        <Link
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={commonClasses}
        >
            {linkContent}
        </Link>
    );
}


export function Sidebar({ isMobileOpen, setMobileOpen, isCollapsed, setCollapsed }: SidebarProps) {
  
  const sidebarHeader = (
    <div className={cn("flex items-center h-16 px-4 border-b", isCollapsed ? "justify-center" : "justify-between")}>
      <Button variant="ghost" onClick={() => setCollapsed(!isCollapsed)} className={cn('flex items-center gap-2 font-bold p-2 h-auto', isCollapsed && 'w-full justify-center')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-7 w-7 text-primary shrink-0">
            <rect width="256" height="256" fill="none"></rect>
            <path d="M88,144V112a32,32,0,0,1,64,0v32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M128,176a24,24,0,1,0-24-24A24,24,0,0,0,128,176Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
        </svg>
        <div className={cn("flex flex-col overflow-hidden transition-all duration-300", isCollapsed ? "w-0" : "w-auto ml-0")}>
            <span className="text-lg whitespace-nowrap">Zentry</span>
        </div>
      </Button>
    </div>
  );

  const navContent = (
    <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-2 p-4">
            {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} setMobileOpen={setMobileOpen} />
            ))}
        </nav>
    </TooltipProvider>
  );

  const footerNav = (
      <div className="mt-auto border-t p-4">
        <TooltipProvider delayDuration={0}>
          <NavItem item={settingsNavItem} isCollapsed={isCollapsed} setMobileOpen={setMobileOpen} />
        </TooltipProvider>
      </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 md:hidden',
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="border-b p-4 flex justify-between items-center h-16">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex h-full max-h-screen flex-col">
            {navContent}
            {footerNav}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r bg-card fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
        )}>
        <div className="flex h-full max-h-screen flex-col">
            {sidebarHeader}
            {navContent}
            {footerNav}
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ setMobileOpen }: { setMobileOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
        >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
        </Button>
    )
}
