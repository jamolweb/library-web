'use client'

import { useEffect, useRef } from 'react'

export default function DeleteModal({ isOpen, onClose, onDelete, itemName }) {
	const modalRef = useRef(null)

	useEffect(() => {
		const handleEscape = event => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		const handleClickOutside = event => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div
				ref={modalRef}
				className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'
				role='dialog'
				aria-modal='true'
				aria-labelledby='modal-title'
			>
				<h2 id='modal-title' className='text-xl font-semibold mb-4'>
					Delete Confirmation
				</h2>
				<p className='text-gray-600 mb-6'>
					Are you sure you want to delete {itemName}? This action cannot be
					undone.
				</p>
				<div className='flex justify-end space-x-4'>
					<button
						onClick={onClose}
						className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={onDelete}
						className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}
