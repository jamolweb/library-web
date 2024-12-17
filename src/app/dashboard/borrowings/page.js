'use client'
import { BorrowingTable } from '@/app/components/BorrowingTable'
import { SearchBar } from '@/app/components/ui/SearchBar'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function BorrowingsPage() {
	const [borrowings, setBorrowings] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	const fetchBorrowings = async () => {
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/borrowings?search=${searchQuery}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await response.json()
			setBorrowings(data)
		} catch (error) {
			setError('Failed to fetch borrowings')
			console.error('Failed to fetch borrowings:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchBorrowings()
	}, [searchQuery])

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='bg-white rounded-lg shadow-sm'>
					{/* Header */}
					<div className='border-b border-gray-200 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>Borrowings</h1>
								<p className='mt-1 text-sm text-gray-500'>
									Manage and track book borrowings
								</p>
							</div>
							<Link
								href='/dashboard/borrowings/new'
								className='inline-flex items-center px-4 py-2 border border-transparent 
										 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 
										 hover:bg-blue-700 focus:outline-none focus:ring-2 
										 focus:ring-offset-2 focus:ring-blue-500'
							>
								New Borrowing
							</Link>
						</div>

						{/* Search Bar */}
						<div className='mt-4'>
							<SearchBar
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder='Search by student name or book title...'
							/>
						</div>
					</div>

					{/* Content */}
					<div className='px-6 py-4'>
						{error && (
							<div className='mb-4 bg-red-50 border-l-4 border-red-400 p-4'>
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

						{isLoading ? (
							<div className='flex justify-center py-8'>
								<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
							</div>
						) : (
							<div className='mt-4'>
								<BorrowingTable
									borrowings={borrowings}
									onBorrowingsChange={setBorrowings}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
