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

		// Get searchParams from URL
		const { searchParams } = new URL(request.url)
		const search = searchParams.get('search')

		let books

		if (search) {
			books = await prisma.book.findMany({
				where: {
					OR: [
						{ title: { contains: search, mode: 'insensitive' } },
						{ author: { contains: search, mode: 'insensitive' } },
					],
				},
			})
		} else {
			books = await prisma.book.findMany()
		}

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
		if (!authResult.success) {
			return NextResponse.json({ error: authResult.error }, { status: 401 })
		}

		const { title, author, quantity } = await request.json()

		// Validate required fields
		if (!title || !author || !quantity) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			)
		}

		// Convert quantity to integer and validate
		const quantityInt = parseInt(quantity, 10)
		if (isNaN(quantityInt) || quantityInt < 0) {
			return NextResponse.json(
				{ error: 'Quantity must be a valid positive number' },
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
