'use client'

import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-hot-toast'

export default function EditModal({ isOpen, onClose, book, onSave }) {
	const [formData, setFormData] = useState({
		id: '',
		title: '',
		author: '',
		quantity: 0,
		available: 0,
	})
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (book) {
			setFormData({
				id: book.id || '',
				title: book.title || '',
				author: book.author || '',
				quantity: book.quantity || 0,
				available: book.available || 0,
			})
		} else {
			setFormData({
				id: '',
				title: '',
				author: '',
				quantity: 0,
				available: 0,
			})
		}
		setErrors({})
	}, [book])

	const handleChange = e => {
		const { name, value } = e.target
		const numberFields = ['quantity', 'available']
		const newValue = numberFields.includes(name) ? Number(value) : value
		setFormData(prev => ({ ...prev, [name]: newValue }))
	}

	const validateForm = () => {
		const newErrors = {}
		if (!formData.title || formData.title.length < 2) {
			newErrors.title = 'Title must be at least 2 characters long'
		}
		if (!formData.author || formData.author.length < 2) {
			newErrors.author = 'Author must be at least 2 characters long'
		}
		if (formData.quantity < 0) {
			newErrors.quantity = 'Quantity must be a positive number'
		}
		if (formData.available < 0) {
			newErrors.available = 'Available must be a positive number'
		}
		return newErrors
	}

	const handleSave = async () => {
		console.log('Save button clicked')
		console.log('Form data before validation:', formData)

		setIsSubmitting(true)
		const validationErrors = validateForm()
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			setIsSubmitting(false)
			return
		}

		try {
			const success = await onSave(formData)
			if (success) {
				onClose()
			}
		} catch (error) {
			console.error('Error saving book:', error)
			toast.error('An unexpected error occurred. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!isOpen) return null

	return (
		<ErrorBoundary
			FallbackComponent={({ error, resetErrorBoundary }) => (
				<div role='alert'>
					<p>Something went wrong:</p>
					<pre>{error.message}</pre>
					<button onClick={resetErrorBoundary}>Try again</button>
				</div>
			)}
			onReset={() => {
				setFormData({
					id: '',
					title: '',
					author: '',
					quantity: 0,
					available: 0,
				})
			}}
		>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
				<div className='bg-white p-8 rounded-lg shadow-xl w-96'>
					<h2 className='text-2xl font-bold mb-6 text-center'>
						{book ? 'Edit Book' : 'Add Book'}
					</h2>
					<div className='space-y-4'>
						{/* Title Input */}
						<div>
							<label className='block mb-2 font-medium'>Title</label>
							<input
								type='text'
								name='title'
								value={formData.title}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded ${
									errors.title ? 'border-red-500' : 'border-gray-300'
								}`}
							/>
							{errors.title && (
								<p className='text-red-500 text-sm mt-1'>{errors.title}</p>
							)}
						</div>

						{/* Author Input */}
						<div>
							<label className='block mb-2 font-medium'>Author</label>
							<input
								type='text'
								name='author'
								value={formData.author}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded ${
									errors.author ? 'border-red-500' : 'border-gray-300'
								}`}
							/>
							{errors.author && (
								<p className='text-red-500 text-sm mt-1'>{errors.author}</p>
							)}
						</div>

						{/* Quantity Input */}
						<div>
							<label className='block mb-2 font-medium'>Quantity</label>
							<input
								type='number'
								name='quantity'
								value={formData.quantity}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded ${
									errors.quantity ? 'border-red-500' : 'border-gray-300'
								}`}
							/>
							{errors.quantity && (
								<p className='text-red-500 text-sm mt-1'>{errors.quantity}</p>
							)}
						</div>

						{/* Available Input */}
						<div>
							<label className='block mb-2 font-medium'>Available</label>
							<input
								type='number'
								name='available'
								value={formData.available}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded ${
									errors.available ? 'border-red-500' : 'border-gray-300'
								}`}
							/>
							{errors.available && (
								<p className='text-red-500 text-sm mt-1'>{errors.available}</p>
							)}
						</div>

						{/* Action Buttons */}
						<div className='flex justify-end space-x-4 mt-6'>
							<button
								type='button'
								onClick={onClose}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								type='button'
								onClick={handleSave}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50'
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Saving...' : 'Save'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	)
}
