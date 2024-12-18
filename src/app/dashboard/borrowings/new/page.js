'use client'
import { SearchBar } from '@/app/components/ui/SearchBar'
import { useEffect, useState } from 'react'

export default function NewBorrowingPage() {
	const [students, setStudents] = useState([])
	const [books, setBooks] = useState([])
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [selectedBook, setSelectedBook] = useState(null)
	const [studentSearch, setStudentSearch] = useState('')
	const [bookSearch, setBookSearch] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const token = localStorage.getItem('token')
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await fetch(`/api/students?search=${studentSearch}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await response.json()
				setStudents(data)
			} catch (error) {
				console.error('Failed to fetch students:', error)
			}
		}
		fetchStudents()
	}, [studentSearch])

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await fetch(`/api/books?search=${bookSearch}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await response.json()
				setBooks(data)
			} catch (error) {
				console.error('Failed to fetch books:', error)
			}
		}
		fetchBooks()
	}, [bookSearch])

	const handleSubmit = async e => {
		e.preventDefault()
		setIsLoading(true)
		setError('')
		setSuccess('')

		if (!selectedStudent || !selectedBook) {
			setError('Please select both a student and a book')
			setIsLoading(false)
			return
		}
		const token = localStorage.getItem('token')

		try {
			const response = await fetch('/api/borrowings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					studentId: selectedStudent.id,
					bookId: selectedBook.id,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create borrowing')
			}

			setSuccess('Book borrowed successfully!')
			setSelectedStudent(null)
			setSelectedBook(null)
			setStudentSearch('')
			setBookSearch('')
		} catch (error) {
			setError(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8'>
				<div className='mb-8 border-b pb-4'>
					<h1 className='text-3xl font-bold text-gray-900'>New Borrowing</h1>
					<p className='mt-2 text-gray-600'>
						Create a new book borrowing record
					</p>
				</div>

				{error && (
					<div className='mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<svg
									className='h-5 w-5 text-red-400'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='ml-3'>
								<p className='text-sm text-red-700'>{error}</p>
							</div>
						</div>
					</div>
				)}

				{success && (
					<div className='mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<svg
									className='h-5 w-5 text-green-400'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='ml-3'>
								<p className='text-sm text-green-700'>{success}</p>
							</div>
						</div>
					</div>
				)}

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					{/* Student Selection */}
					<div className='space-y-4'>
						<div className='bg-gray-50 p-4 rounded-lg'>
							<h2 className='text-lg font-semibold text-gray-900 mb-4'>
								Select Student
							</h2>
							<SearchBar
								value={studentSearch}
								onChange={setStudentSearch}
								placeholder='Search students...'
								className='mb-4'
							/>
							<div className='bg-white border rounded-lg max-h-[300px] overflow-y-auto'>
								{students.length === 0 ? (
									<div className='p-4 text-center text-gray-500'>
										No students found
									</div>
								) : (
									students.map(student => (
										<div
											key={student.id}
											onClick={() => setSelectedStudent(student)}
											className={`p-4 cursor-pointer border-b last:border-b-0 transition-colors
												${
													selectedStudent?.id === student.id
														? 'bg-blue-50 border-blue-100'
														: 'hover:bg-gray-50'
												}`}
										>
											<div className='font-medium text-gray-900'>
												{student.fullName}
											</div>
											<div className='text-sm text-gray-500'>
												Grade: {student.grade}
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>

					{/* Book Selection */}
					<div className='space-y-4'>
						<div className='bg-gray-50 p-4 rounded-lg'>
							<h2 className='text-lg font-semibold text-gray-900 mb-4'>
								Select Book
							</h2>
							<SearchBar
								value={bookSearch}
								onChange={setBookSearch}
								placeholder='Search books...'
								className='mb-4'
							/>
							<div className='bg-white border rounded-lg max-h-[300px] overflow-y-auto'>
								{books.length === 0 ? (
									<div className='p-4 text-center text-gray-500'>
										No books found
									</div>
								) : (
									books.map(book => (
										<div
											key={book.id}
											onClick={() => setSelectedBook(book)}
											className={`p-4 cursor-pointer border-b last:border-b-0 transition-colors
												${
													selectedBook?.id === book.id
														? 'bg-blue-50 border-blue-100'
														: 'hover:bg-gray-50'
												}`}
										>
											<div className='font-medium text-gray-900'>
												{book.title}
											</div>
											<div className='text-sm text-gray-500'>
												By {book.author}
											</div>
											<div className='text-sm text-gray-500'>
												Available: {book.available} of {book.quantity}
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Summary and Submit */}
				<div className='mt-8 pt-6 border-t'>
					<div className='bg-gray-50 p-4 rounded-lg mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							Borrowing Summary
						</h3>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<div className='text-sm font-medium text-gray-500'>
									Selected Student
								</div>
								<div className='mt-1'>
									{selectedStudent ? (
										<span className='text-gray-900'>
											{selectedStudent.fullName}
										</span>
									) : (
										<span className='text-gray-400'>No student selected</span>
									)}
								</div>
							</div>
							<div>
								<div className='text-sm font-medium text-gray-500'>
									Selected Book
								</div>
								<div className='mt-1'>
									{selectedBook ? (
										<span className='text-gray-900'>{selectedBook.title}</span>
									) : (
										<span className='text-gray-400'>No book selected</span>
									)}
								</div>
							</div>
						</div>
					</div>

					<button
						type='button'
						onClick={handleSubmit}
						disabled={isLoading || !selectedStudent || !selectedBook}
						className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
							${
								isLoading || !selectedStudent || !selectedBook
									? 'bg-gray-300 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700'
							}`}
					>
						{isLoading ? (
							<span className='flex items-center justify-center'>
								<svg
									className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
								Processing...
							</span>
						) : (
							'Create Borrowing'
						)}
					</button>
				</div>
			</div>
		</div>
	)
}
