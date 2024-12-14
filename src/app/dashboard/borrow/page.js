"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import toast from "react-hot-toast";

export default function BorrowBook() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 14), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [booksRes, studentsRes] = await Promise.all([
          fetch("/api/books", { headers }),
          fetch("/api/students", { headers }),
        ]);

        const [booksData, studentsData] = await Promise.all([
          booksRes.json(),
          studentsRes.json(),
        ]);

        setBooks(booksData.filter((book) => book.available > 0));
        setStudents(studentsData);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/borrowings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: parseInt(selectedBook),
          studentId: parseInt(selectedStudent),
          dueDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to create borrowing");

      toast.success("Book borrowed successfully");
      // Reset form
      setSelectedBook("");
      setSelectedStudent("");
      setDueDate(format(addDays(new Date(), 14), "yyyy-MM-dd"));
    } catch (error) {
      toast.error("Failed to borrow book");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Borrow a Book</h1>

      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="book"
            >
              Book
            </label>
            <select
              id="book"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} (Available: {book.available})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="student"
            >
              Student
            </label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Borrow Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
