import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, password, fullName } = await request.json();

    // Validate required fields
    if (!username || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the teacher in the database
    const newTeacher = await prisma.teacher.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
      },
    });

    delete newTeacher.password;

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
