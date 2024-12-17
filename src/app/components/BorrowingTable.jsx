'use client'
import { useState } from 'react'

export function BorrowingTable({ borrowings, onBorrowingsChange }) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [processingId, setProcessingId] = useState(null)

	const handleReturn = async borrowingId => {
		const token = localStorage.getItem('token')
		setProcessingId(borrowingId)
		try {
			setIsLoading(true)
			setError('')

			const response = await fetch(`/api/borrowings/${borrowingId}/return`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to return book')
			}

			// Remove the returned book from the list
			if (onBorrowingsChange) {
				onBorrowingsChange(prevBorrowings =>
					prevBorrowings.filter(borrowing => borrowing.id !== borrowingId)
				)
			}
		} catch (error) {
			setError('Failed to return book: ' + error.message)
			console.error('Failed to return book:', error)
		} finally {
			setIsLoading(false)
			setProcessingId(null)
		}
	}

	if (!borrowings.length) {
		return (
			<div className='text-center py-12'>
				<svg
					className='mx-auto h-12 w-12 text-gray-400'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					aria-hidden='true'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
					/>
				</svg>
				<h3 className='mt-2 text-sm font-medium text-gray-900'>
					No borrowings
				</h3>
				<p className='mt-1 text-sm text-gray-500'>
					Get started by creating a new borrowing.
				</p>
			</div>
		)
	}

	return (
		<div>
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

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Student
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Book
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Borrow Date
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
						{borrowings.map(borrowing => (
							<tr key={borrowing.id} className='hover:bg-gray-50'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-gray-900'>
										{borrowing.student.fullName}
									</div>
									<div className='text-sm text-gray-500'>
										Grade: {borrowing.student.grade}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-gray-900'>
										{borrowing.book.title}
									</div>
									<div className='text-sm text-gray-500'>
										By {borrowing.book.author}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{new Date(borrowing.borrowDate).toLocaleDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
										borrowing.status === 'BORROWED'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-green-100 text-green-800'
									}`}
									>
										{borrowing.status}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{borrowing.status === 'BORROWED' && (
										<button
											onClick={() => handleReturn(borrowing.id)}
											disabled={isLoading || processingId === borrowing.id}
											className={`inline-flex items-center px-3 py-1 border border-transparent 
                  text-sm leading-4 font-medium rounded-md text-white 
                  ${
										isLoading && processingId === borrowing.id
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
									}`}
										>
											{isLoading && processingId === borrowing.id ? (
												<>
													<svg
														className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
												</>
											) : (
												'Return Book'
											)}
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
