// src/app/api/auth/login/route.js
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(request) {
	try {
		const { username, password } = await request.json()

		// Fetch the teacher from the database
		const teacher = await prisma.teacher.findUnique({
			where: { username },
		})

		if (!teacher) {
			return NextResponse.json(
				{ error: 'Invalid username or password' },
				{ status: 401 }
			)
		}

		// Verify the password
		const isPasswordValid = await bcrypt.compare(password, teacher.password)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: 'Invalid username or password' },
				{ status: 401 }
			)
		}

		teacher.password = undefined

		// Generate JWT token
		const token = jwt.sign(
			{ userId: teacher.id, username: teacher.username, role: 'teacher' },
			process.env.JWT_SECRET,
			{ expiresIn: '10d' }
		)

		return NextResponse.json({ token, teacher }, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 500 }
		)
	}
}
