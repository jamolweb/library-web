import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema
const BookUpdateSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().optional(),
})

// Utility function for handling errors
function handleError(error) {
	console.error('API Error:', error)

	if (error instanceof z.ZodError) {
		return NextResponse.json(
			{
				message: 'Validation Error',
				errors: error.errors.map(err => ({
					field: err.path.join('.'),
					message: err.message,
				})),
			},
			{ status: 400 }
		)
	}

	// Generic server error
	return NextResponse.json(
		{ message: 'Internal Server Error' },
		{ status: 500 }
	)
}

export async function GET(request, { params }) {
	try {
		// Verify JWT token
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { id } = params

		const book = await prisma.book.findUnique({
			where: { id },
			include: {
				borrowedBy: true, // Include student info if borrowed
			},
		})

		if (!book) {
			return NextResponse.json({ error: 'Book not found' }, { status: 404 })
		}

		return NextResponse.json(book)
	} catch (error) {
		return handleError(error)
	}
}

export async function PUT(request, { params }) {
	try {
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { id } = params
		const body = await request.json()

		// Validate input
		const validatedData = BookUpdateSchema.parse(body)

		const updatedBook = await prisma.book.update({
			where: { id: Number(id) },
			data: validatedData,
		})

		return NextResponse.json(updatedBook)
	} catch (error) {
		return handleError(error)
	}
}

export async function DELETE(request, { params }) {
	try {
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { id } = params

		await prisma.book.delete({
			where: { id },
		})

		return NextResponse.json(
			{ message: 'Book deleted successfully' },
			{ status: 200 }
		)
	} catch (error) {
		return handleError(error)
	}
}
