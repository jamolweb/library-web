// src/app/dashboard/borrowings/page.js
'use client'

import { Dialog } from '@headlessui/react'
import axios from 'axios'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ManageBorrowings() {
	const [borrowings, setBorrowings] = useState([])
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
	const [selectedBorrowing, setSelectedBorrowing] = useState(null)
	const [filter, setFilter] = useState('')
	const [sortOrder, setSortOrder] = useState('asc')

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('token')
			if (!token) {
				router.push('/login')
				return
			}

			try {
				const response = await axios.get('/api/borrowings', {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				})

				setBorrowings(Array.isArray(response.data) ? response.data : [])
			} catch (error) {
				console.error('Error fetching borrowings:', error)
				toast.error('Failed to fetch borrowings')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [router])

	const openDeleteModal = borrowing => {
		setSelectedBorrowing(borrowing)
		setDeleteModalOpen(true)
	}

	const handleDelete = async () => {
		try {
			const token = localStorage.getItem('token')
			await axios.delete(`/api/borrowings/${selectedBorrowing.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setBorrowings(borrowings.filter(b => b.id !== selectedBorrowing.id))
			toast.success('Borrowing record deleted successfully')
		} catch (error) {
			console.error('Error deleting borrowing:', error)
			toast.error('Failed to delete borrowing')
		} finally {
			setDeleteModalOpen(false)
		}
	}

	const filteredBorrowings = borrowings.filter(borrowing =>
		borrowing.student.fullName.toLowerCase().includes(filter.toLowerCase())
	)

	const sortedBorrowings = filteredBorrowings.sort((a, b) => {
		const dateA = new Date(a.borrowDate)
		const dateB = new Date(b.borrowDate)
		return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
	})

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>Manage Borrowings</h1>

			<div className='mb-4'>
				<input
					type='text'
					placeholder='Search by student name...'
					value={filter}
					onChange={e => setFilter(e.target.value)}
					className='border rounded p-2'
				/>
				<select
					value={sortOrder}
					onChange={e => setSortOrder(e.target.value)}
					className='border rounded p-2 ml-2'
				>
					<option value='asc'>Sort by Borrow Date (Asc)</option>
					<option value='desc'>Sort by Borrow Date (Desc)</option>
				</select>
			</div>

			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Book
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Student
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Borrow Date
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Due Date
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Status
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Actions
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{sortedBorrowings.map(borrowing => (
						<tr key={borrowing.id}>
							<td className='px-6 py-4 whitespace-nowrap'>
								{borrowing.book.title}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								{borrowing.student.fullName}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								{format(new Date(borrowing.borrowDate), 'MMM dd, yyyy')}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								{format(new Date(borrowing.dueDate), 'MMM dd, yyyy')}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								{borrowing.status}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => openDeleteModal(borrowing)}
									className='text-red-600 hover:text-red-900'
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Dialog
				open={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
			>
				<div className='fixed inset-0 bg-black/30' aria-hidden='true' />
				<div className='fixed inset-0 flex items-center justify-center p-4'>
					<Dialog.Panel className='mx-auto max-w-sm rounded bg-white p-6'>
						<Dialog.Title className='text-lg font-bold'>
							Confirm Deletion
						</Dialog.Title>
						<Dialog.Description className='mt-2'>
							Are you sure you want to delete this borrowing record?
						</Dialog.Description>
						<div className='mt-4 flex justify-end'>
							<button
								onClick={() => setDeleteModalOpen(false)}
								className='mr-2 text-gray-500'
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className='bg-red-600 text-white px-4 py-2 rounded'
							>
								Delete
							</button>
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</div>
	)
}
