import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (
      !user ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date()
    ) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (error) {
    console.error("Error during password reset:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}