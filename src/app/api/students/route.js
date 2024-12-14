// src/app/api/students/route.js
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

    const students = await prisma.student.findMany();

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify JWT token
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { fullName, phoneNumber } = await request.json();

    // Validate required fields
    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        fullName,
        phoneNumber,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
