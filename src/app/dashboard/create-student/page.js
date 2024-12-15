'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CreateStudent() {
	const [fullName, setFullName] = useState('')
	const [description, setDescription] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [grade, setGrade] = useState('')
	const router = useRouter()

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const token = localStorage.getItem('token')
			const response = await axios.post(
				'/api/students',
				{
					fullName,
					description,
					phoneNumber,
					grade,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)

			if (response.status !== 201) throw new Error('Failed to create student')

			toast.success('Student created successfully')
			router.push('/dashboard/students')
		} catch (error) {
			toast.error(error.response?.data?.error || error.message)
		}
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>Create Student</h1>
			<form
				onSubmit={handleSubmit}
				className='max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
			>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='fullName'
					>
						Full Name
					</label>
					<input
						type='text'
						id='fullName'
						value={fullName}
						onChange={e => setFullName(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='description'
					>
						Description
					</label>
					<textarea
						id='description'
						value={description}
						onChange={e => setDescription(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='phoneNumber'
					>
						Phone Number
					</label>
					<input
						type='text'
						id='phoneNumber'
						value={phoneNumber}
						onChange={e => setPhoneNumber(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='grade'
					>
						Grade
					</label>
					<input
						type='text'
						id='grade'
						value={grade}
						onChange={e => setGrade(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='flex items-center justify-between'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Create Student
					</button>
				</div>
			</form>
		</div>
	)
}
