import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema
const StudentUpdateSchema = z.object({
	fullName: z
		.string()
		.min(2, { message: 'Full name must be at least 2 characters' }),
	phoneNumber: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }),
	description: z.string().optional(),
	grade: z.string().optional(),
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

// Get Student by ID
export async function GET(request, { params }) {
	const authResult = await verifyAuth(request)
	if (!authResult.success) {
		return NextResponse.json({ error: authResult.error }, { status: 401 })
	}

	try {
		const studentId = parseInt(params.id, 10)
		if (isNaN(studentId)) {
			return NextResponse.json(
				{ message: 'Invalid student ID' },
				{ status: 400 }
			)
		}

		const student = await prisma.student.findUnique({
			where: { id: studentId },
			select: {
				id: true,
				fullName: true,
				phoneNumber: true,
				description: true,
				grade: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		if (!student) {
			return NextResponse.json(
				{ message: 'Student not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(student)
	} catch (error) {
		return handleError(error)
	}
}

// Update Student
export async function PUT(request, { params }) {
	const authResult = await verifyAuth(request)
	if (!authResult.success) {
		return NextResponse.json({ error: authResult.error }, { status: 401 })
	}

	try {
		const { id } = params
		const body = await request.json()

		// Validate input
		const validatedData = StudentUpdateSchema.parse(body)

		// Check if student exists before updating
		const existingStudent = await prisma.student.findUnique({
			where: { id },
		})

		if (!existingStudent) {
			return NextResponse.json(
				{ message: 'Student not found' },
				{ status: 404 }
			)
		}

		const updatedStudent = await prisma.student.update({
			where: { id },
			data: validatedData,
			select: {
				id: true,
				fullName: true,
				phoneNumber: true,
				description: true,
				grade: true,
				updatedAt: true,
			},
		})

		return NextResponse.json(updatedStudent)
	} catch (error) {
		return handleError(error)
	}
}

// Delete Student
export async function DELETE(request, { params }) {
	try {
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { id } = params

		// Delete the student directly using the string ID
		await prisma.student.delete({
			where: { id },
		})

		return new NextResponse(null, { status: 204 })
	} catch (error) {
		return handleError(error)
	}
}
