'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CreateBook() {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [quantity, setQuantity] = useState(1)
	const router = useRouter()

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const token = localStorage.getItem('token')
			const response = await axios.post(
				'/api/books',
				{
					title,
					author,
					quantity,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)

			if (response.status !== 201) throw new Error('Failed to create book')

			toast.success('Book created successfully')
			router.push('/dashboard/books')
		} catch (error) {
			toast.error(error.message)
		}
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>Create Book</h1>
			<form onSubmit={handleSubmit} className='max-w-lg mx-auto'>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='title'
					>
						Title
					</label>
					<input
						type='text'
						id='title'
						value={title}
						onChange={e => setTitle(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='author'
					>
						Author
					</label>
					<input
						type='text'
						id='author'
						value={author}
						onChange={e => setAuthor(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='quantity'
					>
						Quantity
					</label>
					<input
						type='number'
						id='quantity'
						value={quantity}
						onChange={e => setQuantity(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='flex items-center justify-between'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Create Book
					</button>
				</div>
			</form>
		</div>
	)
}
