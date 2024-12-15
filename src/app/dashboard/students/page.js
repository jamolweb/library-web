'use client'
import DataTable from '@/app/components/ui/DataTable'
import DeleteModal from '@/app/components/ui/DeleteModal'
import EditModal from '@/app/components/ui/EditModal'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const fetchStudents = async () => {
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
		return response.data // Assuming the data is an array of objects
	} catch (error) {
		console.error(error)
		toast.error('Error fetching students')
	}
}

const ManageStudents = () => {
	const [students, setStudents] = useState([])
	const [loading, setLoading] = useState(true)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [studentToDelete, setStudentToDelete] = useState(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [studentToEdit, setStudentToEdit] = useState(null)
	const router = useRouter()
	useEffect(() => {
		;(async () => {
			const studentsData = await fetchStudents()
			setStudents(studentsData) // Assuming the response data is an array of objects
			setLoading(false)
		})()
	}, [router])

	const columns = [
		{
			header: 'Full Name',
			accessor: 'fullName',
		},
		{
			header: 'Description',
			accessor: 'description',
		},
		{
			header: 'Phone Number',
			accessor: 'phoneNumber',
		},
		{
			header: 'Grade',
			accessor: 'grade',
		},
		{
			header: 'Actions',
			cell: row => (
				<div>
					<button onClick={() => handleEdit(row)} className='text-blue-600'>
						Edit
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className='text-red-600 ml-2'
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
		setStudentToDelete({
			id,
			fullName: students.find(student => student.id === id).fullName,
		})
		setIsDeleteModalOpen(true)
	}

	const handleSave = updatedStudent => {
		setStudents(
			students.map(student =>
				student.id === updatedStudent.id ? updatedStudent : student
			)
		)
		setIsEditModalOpen(false)
	}

	console.log({ students, columns })

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<DataTable columns={columns} data={students} />
			)}
			{isDeleteModalOpen && (
				<DeleteModal
					studentToDelete={studentToDelete}
					onConfirm={() => handleSave()}
					onClose={() => setIsDeleteModalOpen(false)}
				/>
			)}
			{isEditModalOpen && (
				<EditModal
					isOpen={isEditModalOpen}
					studentToEdit={studentToEdit}
					onConfirm={() => handleSave()}
					onClose={() => setIsEditModalOpen(false)}
				/>
			)}
		</div>
	)
}

export default ManageStudents
