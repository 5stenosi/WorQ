import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { client: true, agency: true },
    });

    const isComplete = !!user?.client || !!user?.agency;
    return NextResponse.json({ complete: isComplete });
  } catch (err) {
    console.error("Error while checking profile:", err);
    return NextResponse.json({ complete: false });
  }
}
