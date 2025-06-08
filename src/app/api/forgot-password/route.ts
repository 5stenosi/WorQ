import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // For privacy and security, do not reveal if the email doesn't exist in the system
    if (!user) return NextResponse.json({}, { status: 200 });

    if (!user.password) return NextResponse.json({}, { status: 200 });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await sendResetEmail(email, resetUrl);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Errore nella richiesta forgot-password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}