// src/app/api/books/route.js
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

		const books = await prisma.book.findMany()

		return NextResponse.json(books)
	} catch (error) {
		console.log(error)

		return NextResponse.json(
			{ error: 'Failed to fetch books' },
			{ status: 500 }
		)
	}
}

export async function POST(request) {
	try {
		const authResult = await verifyAuth(request)
		console.log(authResult)

		if (authResult.role === 'teacher') {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { title, author, quantity } = await request.json()

		// Convert quantity to integer
		const quantityInt = parseInt(quantity, 10)

		// Validate input
		if (!title || !author || quantityInt < 1) {
			return NextResponse.json(
				{ error: 'All fields are required and quantity must be at least 1' },
				{ status: 400 }
			)
		}

		// Check if a book with the same title already exists
		const existingBooks = await prisma.book.findMany({
			where: { title: title },
		})

		if (existingBooks.length > 0) {
			return NextResponse.json(
				{ error: 'Book with this title already exists.' },
				{ status: 400 }
			)
		}

		const book = await prisma.book.create({
			data: {
				title,
				author,
				quantity: quantityInt,
				available: quantityInt,
			},
		})

		return NextResponse.json(book, { status: 201 })
	} catch (error) {
		console.log(error)

		return NextResponse.json(
			{ error: 'Failed to create book' },
			{ status: 500 }
		)
	}
}
