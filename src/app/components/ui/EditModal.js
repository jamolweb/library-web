import { useEffect, useState } from 'react'
import './EditModal.css'

const EditModal = ({ isOpen, onClose, student, onSave }) => {
	const [formData, setFormData] = useState(student ?? {})
	useEffect(() => {
		setFormData(student ?? {})
	}, [student])
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}
	const handleSubmit = e => {
		e.preventDefault()
		onSave(formData)
		onClose()
	}

	console.log({ isOpen, onClose, student, onSave })

	return (
		<section
			className={`fixed top-0 left-0 w-full h-screen bg-gray-200 opacity-50 ${
				isOpen ? 'backdrop-blur' : ''
			}`}
		>
			{isOpen && (
				<article
					className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white shadow-md rounded'
					style={{
						gridTemplateRows: 'auto 1fr auto',
						display: 'grid',
						placeItems: 'center',
					}}
				>
					<h2 className='text-lg font-bold'>Edit Student</h2>
					<form onSubmit={handleSubmit}>
						<div>
							<label className='block mb-2'>Full Name</label>
							{student ? (
								<input
									type='text'
									name='fullName'
									value={formData.fullName}
									onChange={handleChange}
									required
									className='px-3 py-2 bg-white border border-gray-300 rounded w-full'
								/>
							) : (
								<p>No student selected</p>
							)}
						</div>
						<div>
							<label className='block mb-2'>Description</label>
							{student ? (
								<input
									type='text'
									name='description'
									value={formData.description}
									onChange={handleChange}
									className='px-3 py-2 bg-white border border-gray-300 rounded w-full'
								/>
							) : null}
						</div>
						<div>
							<label className='block mb-2'>Phone Number</label>
							{student ? (
								<input
									type='text'
									name='phoneNumber'
									value={formData.phoneNumber}
									onChange={handleChange}
									required
									className='px-3 py-2 bg-white border border-gray-300 rounded w-full'
								/>
							) : null}
						</div>
						<div>
							<label className='block mb-2'>Grade</label>
							{student ? (
								<input
									type='text'
									name='grade'
									value={formData.grade}
									onChange={handleChange}
									required
									className='px-3 py-2 bg-white border border-gray-300 rounded w-full'
								/>
							) : null}
						</div>
						<div className='flex justify-end'>
							<button
								type='button'
								onClick={onClose}
								className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
							>
								Cancel
							</button>
							<button
								type='submit'
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4'
							>
								Save
							</button>
						</div>
					</form>
				</article>
			)}
		</section>
	)
}

export default EditModal
