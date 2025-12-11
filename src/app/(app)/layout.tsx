'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setMobileOpen={setMobileOpen}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "ml-20" : "ml-64"
        )}>
        <Header setMobileOpen={setMobileOpen} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
