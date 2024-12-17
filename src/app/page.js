'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const router = useRouter()

	useEffect(() => {
		// Check if user is authenticated
		const token = localStorage.getItem('token')
		if (token) {
			router.push('/dashboard')
		} else {
			router.push('/login')
		}
	}, [router])

	console.log('motherfuckers')

	// Return null or a loading indicator while redirecting
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
		</div>
	)
}
