'use client'

import { Dialog } from '@headlessui/react'

const DeleteModal = ({ isOpen, onClose, onDelete, itemName }) => {
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<div
				className='fixed inset-0 bg-black bg-opacity-30'
				aria-hidden='true'
			/>
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='mx-auto max-w-sm rounded bg-white p-6'>
					<Dialog.Title className='text-lg font-bold'>
						Delete Confirmation
					</Dialog.Title>
					<Dialog.Description className='mt-2'>
						Are you sure you want to delete {itemName}? This action cannot be
						undone.
					</Dialog.Description>
					<div className='mt-4 flex justify-end'>
						<button className='mr-2' onClick={onClose}>
							Cancel
						</button>
						<button className='bg-red-600 text-white' onClick={onDelete}>
							Delete
						</button>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	)
}

export default DeleteModal
