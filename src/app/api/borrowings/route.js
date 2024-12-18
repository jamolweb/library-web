import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Get all borrowings
export async function GET(request) {
	// Verify JWT token
	const authResult = await verifyAuth(request)
	if (!authResult.success) {
		return NextResponse.json({ error: authResult.error }, { status: 401 })
	}

	try {
		// Get searchParams from URL
		const { searchParams } = new URL(request.url)
		const studentId = searchParams.get('studentId')
		const status = searchParams.get('status')
		const search = searchParams.get('search')

		// Build the where clause
		const where = {
			...(studentId && { studentId }),
			...(status && { status }),
			...(search && {
				OR: [
					{
						student: {
							fullName: {
								contains: search,
								mode: 'insensitive',
							},
						},
					},
					{
						book: {
							title: {
								contains: search,
								mode: 'insensitive',
							},
						},
					},
				],
			}),
		}

		const borrowings = await prisma.borrowing.findMany({
			where,
			include: {
				student: true,
				book: true,
			},
		})

		return NextResponse.json(borrowings)
	} catch (error) {
		console.log(error)

		return NextResponse.json(
			{ error: 'Failed to fetch borrowings' },
			{ status: 500 }
		)
	}
}

// Create a new borrowing
export async function POST(request) {
	// Verify JWT token
	const authResult = await verifyAuth(request)
	if (!authResult.success) {
		return NextResponse.json({ error: authResult.error }, { status: 401 })
	}

	try {
		const { studentId, bookId, quantity = 1 } = await request.json()

		// Start a transaction
		const result = await prisma.$transaction(async prisma => {
			// Check book availability
			const book = await prisma.book.findUnique({
				where: { id: bookId },
			})

			if (!book || book.available < quantity) {
				throw new Error('Book not available')
			}

			// Create borrowing record
			const borrowing = await prisma.borrowing.create({
				data: {
					studentId,
					bookId,
					status: 'BORROWED',
				},
			})

			// Update book availability
			await prisma.book.update({
				where: { id: bookId },
				data: { available: book.available - quantity },
			})

			return borrowing
		})

		return NextResponse.json(result, { status: 201 })
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}
}
