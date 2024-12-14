'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch books');

        const data = await response.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Books</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.available}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button className="text-red-600 hover:text-red-900 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
