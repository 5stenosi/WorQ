import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
      return NextResponse.json({ message: "Missing Data" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // crea user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        oauthProvider: "APP",
        oauthId: null, // per compatibilità con schema.prisma
      },
    });

    if (role === "CLIENT" && (!name || !surname || !cellphone)) {
      return NextResponse.json(
        { message: "Missing Client data" },
        { status: 400 }
      );
    }

    if (role === "AGENCY" && (!name || !vatNumber || !telephone)) {
      return NextResponse.json(
        { message: "Missing Agency data" },
        { status: 400 }
      );
    }

    // crea client o agency associato usando connect
    if (role === "CLIENT") {
      await prisma.client.create({
        data: {
          name,
          surname,
          cellphone,
          user: {
            connect: { id: newUser.id }, 
          },
        },
      });
    } else if (role === "AGENCY") {
      await prisma.agency.create({
        data: {
          name,
          vatNumber,
          telephone,
          user: {
            connect: { id: newUser.id },
          },
        },
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during the registration", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
