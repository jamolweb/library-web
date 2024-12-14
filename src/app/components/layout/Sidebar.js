'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library,
  BookOpen,
  Users,
  BookCopy,
  LogOut,
  Menu,
  ChevronLeft,
  Plus,
  Home
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard'
  },
  {
    title: 'Books',
    icon: BookOpen,
    path: '/dashboard/books'
  },
  {
    title: 'Students',
    icon: Users,
    path: '/dashboard/students'
  },
  {
    title: 'Borrowings',
    icon: BookCopy,
    path: '/dashboard/borrowings'
  }
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-xl">Library</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <Link
              href="/dashboard/create-book"
              className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-400" />
              <span>Add Book</span>
            </Link>
            <Link
              href="/dashboard/create-student"
              className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-400" />
              <span>Add Student</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
