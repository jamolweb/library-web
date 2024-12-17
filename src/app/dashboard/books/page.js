'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import DataTable from './DataTable'
import DeleteModal from './DeleteModal'
import EditModal from './EditModal'

export default function ManageBooks() {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [isEditModalOpen, setEditModalOpen] = useState(false)
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
	const [selectedBook, setSelectedBook] = useState(null)

	const router = useRouter()

	const fetchBooks = useCallback(async () => {
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/login')
			return
		}

		try {
			const response = await axios.get('/api/books', {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			setBooks(response.data)
		} catch (error) {
			console.error('Error fetching books:', error)
			toast.error('Failed to fetch books')
		} finally {
			setLoading(false)
		}
	}, [router])

	useEffect(() => {
		fetchBooks()
	}, [fetchBooks])

	const columns = [
		{ header: 'Title', accessor: 'title' },
		{ header: 'Author', accessor: 'author' },
		{ header: 'Quantity', accessor: 'quantity' },
		{ header: 'Available', accessor: 'available' },
		{
			header: 'Actions',
			cell: row => (
				<div className='flex space-x-2'>
					<button
						onClick={() => handleEdit(row)}
						className='text-blue-600 hover:text-blue-800 transition'
					>
						Edit
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className='text-red-600 hover:text-red-800 transition'
					>
						Delete
					</button>
				</div>
			),
		},
	]

	const handleEdit = book => {
		setSelectedBook(book)
		setEditModalOpen(true)
	}

	const handleDelete = id => {
		const bookToDelete = books.find(book => book.id === id)
		if (bookToDelete) {
			setSelectedBook(bookToDelete)
			setDeleteModalOpen(true)
		}
	}

	const handleSave = async updatedBook => {
		console.log('Saving book:', updatedBook)
		try {
			const token = localStorage.getItem('token')
			const url = updatedBook.id ? `/api/books/${updatedBook.id}` : '/api/books'

			const bookData = {
				...updatedBook,
				quantity: Number(updatedBook.quantity),
				available: Number(updatedBook.available),
			}

			const method = updatedBook.id ? 'put' : 'post'

			const response = await axios[method](url, bookData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (updatedBook.id) {
				setBooks(prev =>
					prev.map(book => (book.id === updatedBook.id ? response.data : book))
				)
				toast.success('Book updated successfully')
			} else {
				setBooks(prev => [...prev, response.data])
				toast.success('Book added successfully')
			}

			setEditModalOpen(false)
			return true
		} catch (error) {
			console.error('Error saving book:', error)
			if (error.response?.data?.message) {
				toast.error(error.response.data.message)
			} else {
				toast.error('Failed to save book. Please try again.')
			}
			return false
		}
	}

	const handleDeleteConfirm = async () => {
		if (!selectedBook) return

		try {
			const token = localStorage.getItem('token')
			await axios.delete(`/api/books/${selectedBook.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			setBooks(prev => prev.filter(book => book.id !== selectedBook.id))
			toast.success('Book deleted successfully')
			setDeleteModalOpen(false)
		} catch (error) {
			console.error('Error deleting book:', error)
			toast.error('Failed to delete book')
		}
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>Manage Books</h1>
			{loading ? (
				<div className='flex justify-center items-center h-64'>
					<p className='text-gray-600'>Loading books...</p>
				</div>
			) : (
				<>
					<Link
						className='px-4 py-2 bg-green-600 mb-7 text-white rounded hover:bg-green-700 transition'
						href={'/dashboard/create-book'}
					>
						Add New Book
					</Link>
					<DataTable columns={columns} data={books} />
				</>
			)}

			{isDeleteModalOpen && (
				<DeleteModal
					isOpen={isDeleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onDelete={handleDeleteConfirm}
					itemName={selectedBook?.title || 'this book'}
				/>
			)}

			{isEditModalOpen && (
				<EditModal
					isOpen={isEditModalOpen}
					book={selectedBook}
					onSave={handleSave}
					onClose={() => {
						setEditModalOpen(false)
						setSelectedBook(null)
					}}
				/>
			)}
		</div>
	)
}
