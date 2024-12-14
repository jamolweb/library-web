// src/app/api/books/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    // Verify JWT token
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const books = await prisma.book.findMany();

    return NextResponse.json(books);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    console.log(authResult);

    if (authResult.role === "teacher") {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { title, author, isbn, quantity } = await request.json();

    // Convert quantity to integer
    const quantityInt = parseInt(quantity, 10);

    // Validate input
    if (!title || !author || !isbn || quantityInt < 1) {
      return NextResponse.json(
        { error: "All fields are required and quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Check if the book already exists
    const existingBook = await prisma.book.findUnique({
      where: { isbn },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: "Book with this ISBN already exists" },
        { status: 409 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        quantity: quantityInt,
        available: quantityInt,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
