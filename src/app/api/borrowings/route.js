import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// Get all borrowings
export async function GET(request) {
  try {
    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const borrowings = await prisma.borrowing.findMany({
      include: {
        book: true,
        student: true,
      },
    });

    return NextResponse.json(borrowings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch borrowings" },
      { status: 500 }
    );
  }
}

// Create a new borrowing
export async function POST(request) {
  try {
    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId, studentId, dueDate } = await request.json();

    // Check if book is available
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book || book.available < 1) {
      return NextResponse.json(
        { error: "Book not available" },
        { status: 400 }
      );
    }

    // Create borrowing record and update book availability in a transaction
    const borrowing = await prisma.$transaction(async (prisma) => {
      // Create borrowing record
      const newBorrowing = await prisma.borrowing.create({
        data: {
          bookId,
          studentId,
          dueDate: new Date(dueDate),
          status: "BORROWED",
        },
        include: {
          book: true,
          student: true,
        },
      });

      // Update book availability
      await prisma.book.update({
        where: { id: bookId },
        data: {
          available: {
            decrement: 1,
          },
        },
      });

      return newBorrowing;
    });

    return NextResponse.json(borrowing, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create borrowing" },
      { status: 500 }
    );
  }
}
