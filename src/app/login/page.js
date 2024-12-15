'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
	const [formData, setFormData] = useState({ username: '', password: '' })
	const [error, setError] = useState(null)
	const router = useRouter()

	const handleChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await axios.post('/api/auth/login', formData)
			localStorage.setItem('token', response.data.token) // Save JWT
			router.push('/dashboard') // Redirect to dashboard
		} catch (err) {
			setError(err.response?.data?.error || 'Login failed. Try again.')
		}
	}

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 w-96'>
				<h2 className='text-xl font-bold mb-4 text-center'>Login</h2>
				{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Username
						</label>
						<input
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChange}
							className='w-full px-3 py-2 border rounded'
							placeholder='Enter your username'
							required
						/>
					</div>
					<div className='mb-6'>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Password
						</label>
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className='w-full px-3 py-2 border rounded'
							placeholder='Enter your password'
							required
						/>
					</div>
					<button
						type='submit'
						className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full'
					>
						Login
					</button>
				</form>
			</div>
		</div>
	)
}
