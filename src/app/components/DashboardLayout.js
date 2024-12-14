"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  LogOut,
  Menu,
  X,
  Home,
  BookPlus,
  UserPlus,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Books", icon: BookOpen, path: "/dashboard/books" },
    { name: "Students", icon: Users, path: "/dashboard/students" },
    { name: "Borrowings", icon: Calendar, path: "/dashboard/borrowings" },
    { name: "Add Book", icon: BookPlus, path: "/dashboard/create-book" },
    { name: "Add Student", icon: UserPlus, path: "/dashboard/create-student" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-indigo-600">
            <h1 className="text-xl font-bold text-white">Library Admin</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-200"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`lg:pl-64 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "pl-64" : "pl-0"
        }`}
      >
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
