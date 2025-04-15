import { prisma } from "@/lib/prisma";
import { saltAndHashPassword } from "@/lib/password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      role, // "CLIENT" o "AGENCY"
      name,
      surname, // solo Client
      cellphone,
      vatNumber, // solo Agency
      telephone, // solo Agency
    } = body;

    // controlli di base
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing Data" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "This user already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await saltAndHashPassword(password);

    // crea user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        oauthProvider: "APP",
        oauthId: email, // per compatibilità con schema.prisma
      },
    });

    // crea client o agency associato
    if (role === "CLIENT") {
      await prisma.client.create({
        data: {
          name,
          surname,
          cellphone,
          userEmail: email,
        },
      });
    } else if (role === "AGENCY") {
      await prisma.agency.create({
        data: {
          name,
          vatNumber,
          telephone,
          userEmail: email,
        },
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during the registration", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
