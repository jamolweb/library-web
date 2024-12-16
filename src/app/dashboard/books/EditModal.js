'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const BookSchema = z.object({
	id: z.number().optional(),
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters long' }),
	author: z
		.string()
		.min(2, { message: 'Author must be at least 2 characters long' }),
	quantity: z
		.number()
		.min(0, { message: 'Quantity must be a positive number' }),
	available: z
		.number()
		.min(0, { message: 'Available must be a positive number' }),
})
function ErrorFallback({ error, resetErrorBoundary }) {
	return (
		<div role='alert'>
			<p>Something went wrong:</p>
			<pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	)
}

export default function EditModal({ isOpen, onClose, book, onSave }) {
	const [formData, setFormData] = useState({
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
				id: book.id,
				title: book.title || '',
				author: book.author || '',
				quantity: book.quantity || 0,
				available: book.available || 0,
			})
		} else {
			setFormData({
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

		try {
			BookSchema.pick({ [name]: true }).parse({ [name]: newValue })
			setErrors(prev => {
				const newErrors = { ...prev }
				delete newErrors[name]
				return newErrors
			})
		} catch (error) {
			if (error instanceof z.ZodError) {
				setErrors(prev => ({
					...prev,
					[name]: error.errors[0].message,
				}))
			}
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const validatedData = BookSchema.parse(formData)
			const success = await onSave(validatedData)
			if (success) {
				onClose()
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formErrors = error.errors.reduce((acc, curr) => {
					acc[curr.path[0]] = curr.message
					return acc
				}, {})
				setErrors(formErrors)
			} else if (axios.isAxiosError(error)) {
				if (error.response?.status === 500) {
					toast.error('Server error. Please try again later.')
				} else {
					toast.error('An error occurred. Please try again.')
				}
			} else {
				console.error('Error submitting form:', error)
				toast.error('An unexpected error occurred. Please try again.')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!isOpen) return null

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => {
				setFormData({
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
					<form onSubmit={handleSubmit} className='space-y-4'>
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
								type='submit'
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50'
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Saving...' : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</ErrorBoundary>
	)
}
