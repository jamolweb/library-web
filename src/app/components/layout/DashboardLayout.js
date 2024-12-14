'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-20 lg:pl-64 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
