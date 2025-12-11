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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Dispatch, SetStateAction } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/sessions', icon: MessageSquare, label: 'Sessions' },
  { href: '/users', icon: Users, label: 'Users' },
  { href: '/seats', icon: Armchair, label: 'Seats' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  isCollapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ isMobileOpen, setMobileOpen, isCollapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <TooltipProvider delayDuration={0}>
        <div className="flex-1 space-y-2 px-4 overflow-y-auto">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                           <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                                isActive && 'bg-primary/10 text-primary',
                                isCollapsed && 'justify-center'
                              )}
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                              <span className={cn('overflow-hidden transition-all', isCollapsed ? 'w-0' : 'w-full')}>
                                {item.label}
                              </span>
                            </Link>
                      </TooltipTrigger>
                       {isCollapsed && (
                          <TooltipContent side="right" className="flex items-center gap-4">
                            {item.label}
                          </TooltipContent>
                       )}
                  </Tooltip>
                )
            })}
        </div>
    </TooltipProvider>
  );

  const sidebarHeader = (
    <div className={cn("px-4 py-6 flex items-center gap-2", isCollapsed && "justify-center")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary shrink-0">
            <rect width="256" height="256" fill="none"></rect>
            <path d="M88,144V112a32,32,0,0,1,64,0v32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M128,176a24,24,0,1,0-24-24A24,24,0,0,0,128,176Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
        </svg>
      <div className={cn("flex flex-col overflow-hidden transition-all", isCollapsed ? "w-0" : "w-auto")}>
        <span className="text-xl font-bold">Zentry</span>
      </div>
    </div>
  );

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
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card transition-transform duration-300 md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex h-full max-h-screen flex-col gap-2">
            {sidebarHeader}
            {navContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
        )}>
        <div className="flex h-full max-h-screen flex-col">
            {sidebarHeader}
            {navContent}
            <div className="mt-auto p-4">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-full"
                    onClick={() => setCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>
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
