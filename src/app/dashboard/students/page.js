'use client'

import DataTable from '@/app/components/ui/DataTable'
import DeleteModal from '@/app/components/ui/DeleteModal'
import EditModal from '@/app/components/ui/EditModal'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ManageStudents() {
	const [students, setStudents] = useState([])
	const [loading, setLoading] = useState(true)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [studentToDelete, setStudentToDelete] = useState(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [studentToEdit, setStudentToEdit] = useState(null)

	const router = useRouter()

	const fetchStudents = useCallback(async () => {
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/login')
			return
		}

		try {
			const response = await axios.get('/api/students', {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})
			setStudents(response.data)
		} catch (error) {
			console.error('Error fetching students:', error)
			toast.error('Failed to fetch students. Please try again.')
		} finally {
			setLoading(false)
		}
	}, [router])

	useEffect(() => {
		fetchStudents()
	}, [fetchStudents])

	const columns = [
		{ header: 'Full Name', accessor: 'fullName' },
		{ header: 'Description', accessor: 'description' },
		{ header: 'Phone Number', accessor: 'phoneNumber' },
		{ header: 'Grade', accessor: 'grade' },
		{
			header: 'Actions',
			cell: row => (
				<div className='flex space-x-2'>
					<button
						onClick={() => handleEdit(row)}
						className='text-blue-600 hover:text-blue-800 transition'
					>
						Edit
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className='text-red-600 hover:text-red-800 transition'
					>
						Delete
					</button>
				</div>
			),
		},
	]

	const handleEdit = student => {
		setStudentToEdit(student)
		setIsEditModalOpen(true)
	}

	const handleDelete = id => {
		const studentToDelete = students.find(student => student.id === id)
		if (studentToDelete) {
			setStudentToDelete(studentToDelete)
			setIsDeleteModalOpen(true)
		}
	}

	const handleSave = async updatedStudent => {
		try {
			const token = localStorage.getItem('token')
			const url = updatedStudent.id
				? `/api/students/${updatedStudent.id}`
				: '/api/students'
			console.log({ url, updatedStudent })

			const method = updatedStudent.id ? 'put' : 'post'

			const response = await axios[method](url, updatedStudent, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (updatedStudent.id) {
				setStudents(prev =>
					prev.map(student =>
						student.id === updatedStudent.id ? response.data : student
					)
				)
				toast.success('Student updated successfully')
			} else {
				setStudents(prev => [...prev, response.data])
				toast.success('Student added successfully')
			}

			setIsEditModalOpen(false)
			return true
		} catch (error) {
			console.error('Error saving student:', error)
			toast.error('Failed to save student. Please try again.')
			return false
		}
	}

	const handleDeleteConfirm = async () => {
		if (!studentToDelete) return

		try {
			const token = localStorage.getItem('token')
			await axios.delete(`/api/students/${studentToDelete.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			setStudents(prev =>
				prev.filter(student => student.id !== studentToDelete.id)
			)
			toast.success('Student deleted successfully')
			setIsDeleteModalOpen(false)
		} catch (error) {
			console.error('Error deleting student:', error)
			toast.error('Failed to delete student')
		}
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>Manage Students</h1>
			{loading ? (
				<div className='flex justify-center items-center h-64'>
					<p className='text-gray-600'>Loading students...</p>
				</div>
			) : (
				<>
					<Link
						className=' px-4 py-2 bg-green-600 mb-7 text-white rounded hover:bg-green-700 transition'
						href={'/dashboard/create-student'}
					>
						Add New Student
					</Link>
					<DataTable columns={columns} data={students} />
				</>
			)}

			{isDeleteModalOpen && (
				<DeleteModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					onDelete={handleDeleteConfirm}
					itemName={studentToDelete?.fullName || 'this student'}
				/>
			)}

			{isEditModalOpen && (
				<EditModal
					isOpen={isEditModalOpen}
					student={studentToEdit}
					onSave={handleSave}
					onClose={() => {
						setIsEditModalOpen(false)
						setStudentToEdit(null)
					}}
				/>
			)}
		</div>
	)
}
