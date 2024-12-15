'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'

const StudentSchema = z.object({
	id: z.string().optional(),
	fullName: z
		.string()
		.min(2, { message: 'Full name must be at least 2 characters' }),
	description: z.string().optional(),
	phoneNumber: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }),
	grade: z.string().regex(/^[A-F][-+]?$/, { message: 'Invalid grade format' }),
})

export default function EditModal({ isOpen, onClose, student, onSave }) {
	const [formData, setFormData] = useState({
		fullName: '',
		description: '',
		phoneNumber: '',
		grade: '',
	})
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (student) {
			setFormData({
				id: student.id,
				fullName: student.fullName || '',
				description: student.description || '',
				phoneNumber: student.phoneNumber || '',
				grade: student.grade || '',
			})
			setErrors({})
		}
	}, [student])

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))

		try {
			StudentSchema.pick({ [name]: true }).parse({ [name]: value })
			const newErrors = { ...errors }
			delete newErrors[name]
			setErrors(newErrors)
		} catch (error) {
			if (error instanceof z.ZodError) {
				setErrors(prev => ({
					...prev,
					[name]: error.errors[0].message,
				}))
			}
		}
	}

	const handleSubmit = e => {
		e.preventDefault()

		try {
			const validatedData = StudentSchema.parse(formData)
			onSave(validatedData)
			onClose()
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formErrors = error.errors.reduce((acc, curr) => {
					acc[curr.path[0]] = curr.message
					return acc
				})
				setErrors(formErrors)
			}
		}
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
			<div className='bg-white p-8 rounded-lg shadow-xl w-96'>
				<h2 className='text-2xl font-bold mb-6 text-center'>
					{student ? 'Edit Student' : 'Add Student'}
				</h2>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block mb-2 font-medium'>Full Name</label>
						<input
							type='text'
							name='fullName'
							value={formData.fullName}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded ${
								errors.fullName ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.fullName && (
							<p className='text-red-500 text-sm mt-1'>{errors.fullName}</p>
						)}
					</div>

					<div>
						<label className='block mb-2 font-medium'>Description</label>
						<input
							type='text'
							name='description'
							value={formData.description}
							onChange={handleChange}
							className='w-full px-3 py-2 border border-gray-300 rounded'
						/>
					</div>

					<div>
						<label className='block mb-2 font-medium'>Phone Number</label>
						<input
							type='tel'
							name='phoneNumber'
							value={formData.phoneNumber}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded ${
								errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.phoneNumber && (
							<p className='text-red-500 text-sm mt-1'>{errors.phoneNumber}</p>
						)}
					</div>

					<div>
						<label className='block mb-2 font-medium'>Grade</label>
						<input
							type='text'
							name='grade'
							value={formData.grade}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded ${
								errors.grade ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.grade && (
							<p className='text-red-500 text-sm mt-1'>{errors.grade}</p>
						)}
					</div>

					<div className='flex justify-end space-x-4 mt-6'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'
						>
							Cancel
						</button>
						<button
							type='submit'
							className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}