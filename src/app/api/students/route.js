// src/app/api/students/route.js
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
	try {
		// Verify JWT token
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const students = await prisma.student.findMany()

		return NextResponse.json(students)
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch students' },
			{ status: 500 }
		)
	}
}

export async function POST(request) {
	try {
		// Verify JWT token
		const authResult = await verifyAuth(request)
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { fullName, description, phoneNumber, grade } = await request.json()

		// Validate required fields
		if (!fullName || !description || !phoneNumber || !grade) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			)
		}

		// Ensure phoneNumber is treated as a string
		if (typeof phoneNumber !== 'string') {
			return NextResponse.json(
				{ error: 'Phone number must be a string' },
				{ status: 400 }
			)
		}

		// Validate phone number format (allowing for + and digits)
		if (!/^\+?\d+$/.test(phoneNumber)) {
			return NextResponse.json(
				{ error: 'Phone number must be a numeric string' },
				{ status: 400 }
			)
		}

		const student = await prisma.student.create({
			data: {
				fullName,
				description,
				phoneNumber,
				grade,
			},
		})

		return NextResponse.json(student, { status: 201 })
	} catch (error) {
		console.log(error)

		return NextResponse.json(
			{ error: 'Failed to create student' },
			{ status: 500 }
		)
	}
}
