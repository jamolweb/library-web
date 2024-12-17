'use client'

import { format } from 'date-fns'
import { AlertTriangle, BookOpen, Calendar, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'

export default function Dashboard() {
	const [stats, setStats] = useState({
		books: [],
		students: [],
		borrowings: [],
		loading: true,
	})
	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('token')
			if (!token) {
				router.push('/login')
				return
			}

			try {
				const headers = {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				}

				const [booksRes, studentsRes, borrowingsRes] = await Promise.all([
					fetch('/api/books', { headers }),
					fetch('/api/students', { headers }),
					fetch('/api/borrowings', { headers }),
				])

				if (!booksRes.ok || !studentsRes.ok || !borrowingsRes.ok) {
					throw new Error('Failed to fetch data')
				}

				const [books, students, borrowings] = await Promise.all([
					booksRes.json(),
					studentsRes.json(),
					borrowingsRes.json(),
				])

				setStats({
					books: Array.isArray(books) ? books : [],
					students: Array.isArray(students) ? students : [],
					borrowings: Array.isArray(borrowings) ? borrowings : [],
					loading: false,
				})
			} catch (error) {
				console.error('Error fetching data:', error)
				toast.error('Failed to fetch data')
				setStats(prev => ({ ...prev, loading: false }))
			}
		}

		fetchData()
	}, [router])

	const activeBorrowings = stats.borrowings.filter(b => b.status === 'BORROWED')
	const overdueBorrowings = stats.borrowings.filter(b => b.status === 'OVERDUE')

	if (stats.loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
			</div>
		)
	}

	const borrowingsColumns = [
		{
			header: 'Book',
			accessor: 'book',
			cell: row => row.book?.title || 'N/A',
		},
		{
			header: 'Student',
			accessor: 'student',
			cell: row => row.student?.fullName || 'N/A',
		},
		{
			header: 'Borrow Date',
			accessor: 'borrowDate',
			cell: row => {
				if (!row.borrowDate) return 'N/A'
				try {
					return format(new Date(row.borrowDate), 'MMM dd, yyyy')
				} catch (error) {
					return 'Invalid date'
				}
			},
		},
		{
			header: 'Due Date',
			accessor: 'dueDate',
			cell: row => {
				if (!row.dueDate) return 'N/A'
				try {
					return format(new Date(row.dueDate), 'MMM dd, yyyy')
				} catch (error) {
					return 'Invalid date'
				}
			},
		},
		{
			header: 'Status',
			accessor: 'status',
			cell: row => (
				<span
					className={`px-2 py-1 text-xs font-semibold rounded-full
          ${
						row.status === 'BORROWED'
							? 'bg-yellow-100 text-yellow-800'
							: row.status === 'RETURNED'
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}
				>
					{row.status}
				</span>
			),
		},
	]

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold text-gray-900'>Dashboard Overview</h1>
				<div className='text-sm text-gray-500'>
					Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
				</div>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card className='bg-blue-50'>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-blue-600'>Total Books</p>
								<p className='text-3xl font-bold text-blue-900'>
									{stats.books.length}
								</p>
							</div>
							<BookOpen className='h-8 w-8 text-blue-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='bg-green-50'>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-green-600'>
									Total Students
								</p>
								<p className='text-3xl font-bold text-green-900'>
									{stats.students.length}
								</p>
							</div>
							<Users className='h-8 w-8 text-green-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='bg-yellow-50'>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-yellow-600'>
									Active Borrowings
								</p>
								<p className='text-3xl font-bold text-yellow-900'>
									{activeBorrowings.length}
								</p>
							</div>
							<Calendar className='h-8 w-8 text-yellow-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='bg-red-50'>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-red-600'>
									Overdue Books
								</p>
								<p className='text-3xl font-bold text-red-900'>
									{overdueBorrowings.length}
								</p>
							</div>
							<AlertTriangle className='h-8 w-8 text-red-500' />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Borrowings</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={borrowingsColumns}
						data={stats.borrowings.slice(0, 5)}
						pageSize={5}
						searchable={false}
					/>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Popular Books</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{stats.books
								.sort(
									(a, b) =>
										b.quantity - b.available - (a.quantity - a.available)
								)
								.slice(0, 5)
								.map((book, index) => (
									<div
										key={book.id}
										className='flex items-center justify-between'
									>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-gray-600 w-6'>
												{index + 1}.
											</span>
											<span className='text-sm font-medium text-gray-900'>
												{book.title}
											</span>
										</div>
										<span className='text-sm text-gray-500'>
											{book.quantity - book.available} borrowed
										</span>
									</div>
								))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Active Students</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{stats.students.slice(0, 5).map((student, index) => (
								<div
									key={student.id}
									className='flex items-center justify-between'
								>
									<div className='flex items-center'>
										<span className='text-sm font-medium text-gray-600 w-6'>
											{index + 1}.
										</span>
										<span className='text-sm font-medium text-gray-900'>
											{student.fullName}
										</span>
									</div>
									<span className='text-sm text-gray-500'>
										Grade {student.grade}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
