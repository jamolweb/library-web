'use client'

import DataTable from '@/app/components/ui/DataTable'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ManageBooks() {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const fetchBooks = async () => {
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

				if (response.status === 200) {
					setBooks(response.data)
				} else {
					throw new Error('Failed to fetch books')
				}
			} catch (error) {
				console.error('Error fetching books:', error)
				toast.error('Failed to fetch books')
			} finally {
				setLoading(false)
			}
		}

		fetchBooks()
	}, [router])

	const handleEdit = bookId => {
		// Navigate to edit book page
		router.push(`/dashboard/books/edit/${bookId}`)
	}

	const handleDelete = async bookId => {
		// Handle delete logic here
		// This is a placeholder and should be replaced with actual delete logic
		console.log('Delete book with ID:', bookId)
	}

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>Manage Books</h1>
			<DataTable data={books} onEdit={handleEdit} onDelete={handleDelete} />
		</div>
	)
}
