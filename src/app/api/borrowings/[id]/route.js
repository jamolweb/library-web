import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Return a book
export async function PUT(request, { params }) {
	try {
		const verified = await verifyAuth(request)
		if (!verified) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params
		const borrowingId = parseInt(id)

		// Update borrowing and book availability in a transaction
		const updatedBorrowing = await prisma.$transaction(async prisma => {
			// Get current borrowing
			const borrowing = await prisma.borrowing.findUnique({
				where: { id: borrowingId },
			})

			if (!borrowing) {
				throw new Error('Borrowing not found')
			}

			if (borrowing.status === 'RETURNED') {
				throw new Error('Book already returned')
			}

			// Update borrowing status
			const updated = await prisma.borrowing.update({
				where: { id: borrowingId },
				data: {
					status: 'RETURNED',
					returnDate: new Date(),
				},
				include: {
					book: true,
					student: true,
				},
			})

			// Update book availability
			await prisma.book.update({
				where: { id: borrowing.bookId },
				data: {
					available: {
						increment: 1,
					},
				},
			})

			return updated
		})

		return NextResponse.json(updatedBorrowing)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: error.message || 'Failed to return book' },
			{ status: 500 }
		)
	}
}

// Get specific borrowing
export async function GET(request, { params }) {
	try {
		const verified = await verifyAuth(request)
		if (!verified) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params
		const borrowingId = parseInt(id)

		const borrowing = await prisma.borrowing.findUnique({
			where: { id: borrowingId },
			include: {
				book: true,
				student: true,
			},
		})

		if (!borrowing) {
			return NextResponse.json(
				{ error: 'Borrowing not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(borrowing)
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch borrowing' },
			{ status: 500 }
		)
	}
}
