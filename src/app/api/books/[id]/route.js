import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    // Verify JWT token
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { id } = params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        borrowedBy: true, // Include student info if borrowed
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { id } = params;
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { id } = params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
