'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ManageBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
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
        const response = await fetch('/api/borrowings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch borrowings');

        const data = await response.json();
        setBorrowings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching borrowings:', error);
        toast.error('Failed to fetch borrowings');
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
      <h1 className="text-3xl font-bold mb-8">Manage Borrowings</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {borrowings.map((borrowing) => (
            <tr key={borrowing.id}>
              <td className="px-6 py-4 whitespace-nowrap">{borrowing.book?.title || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{borrowing.student?.fullName || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{borrowing.borrowDate ? format(new Date(borrowing.borrowDate), 'MMM dd, yyyy') : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{borrowing.dueDate ? format(new Date(borrowing.dueDate), 'MMM dd, yyyy') : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${borrowing.status === 'BORROWED' ? 'bg-yellow-100 text-yellow-800' : 
                    borrowing.status === 'RETURNED' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>{borrowing.status || 'N/A'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {borrowing.status === 'BORROWED' && (
                  <button className="text-indigo-600 hover:text-indigo-900">Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
