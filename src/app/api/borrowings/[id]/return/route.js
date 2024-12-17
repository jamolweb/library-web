import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
	try {
		// Verify authentication
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params
		if (!id) {
			return NextResponse.json(
				{ error: 'Invalid borrowing ID' },
				{ status: 400 }
			)
		}

		// Start a transaction
		const result = await prisma.$transaction(async prisma => {
			// Get the borrowing
			const borrowing = await prisma.borrowing.findUnique({
				where: { id },
				include: { book: true },
			})

			if (!borrowing) {
				throw new Error('Borrowing not found')
			}

			if (borrowing.status === 'RETURNED') {
				throw new Error('Book is already returned')
			}

			// Update the borrowing status
			const updatedBorrowing = await prisma.borrowing.delete({ where: { id } })

			// Update the book's available quantity
			await prisma.book.update({
				where: { id: borrowing.bookId },
				data: {
					available: {
						increment: 1,
					},
				},
			})

			return updatedBorrowing
		})

		return NextResponse.json(result)
	} catch (error) {
		console.error('Failed to return book:', error)
		return NextResponse.json(
			{ error: error.message || 'Failed to return book' },
			{ status: 400 }
		)
	}
}
