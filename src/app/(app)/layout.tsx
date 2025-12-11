'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-1 flex-col">
        <Header setMobileOpen={setMobileOpen} />
        <main className="flex-1 bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
