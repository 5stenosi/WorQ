import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, email, ...rest } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { client: true, agency: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check if the user already has a profile
    if (user.client || user.agency) {
      return NextResponse.json(
        { message: "Profile already completed." },
        { status: 400 }
      );
    }

    if (role === "CLIENT") {
      if (!rest.name || !rest.surname || !rest.cellphone) {
        return NextResponse.json(
          { message: "Missing client fields." },
          { status: 400 }
        );
      }
      await prisma.client.create({
        data: {
          name: rest.name,
          surname: rest.surname,
          cellphone: rest.cellphone,
          user: { connect: { email } },
        },
      });
    } else if (role === "AGENCY") {
      if (!rest.name || !rest.vatNumber || !rest.telephone) {
        return NextResponse.json(
          { message: "Missing agency fields." },
          { status: 400 }
        );
      }
      await prisma.agency.create({
        data: {
          name: rest.name,
          vatNumber: rest.vatNumber,
          telephone: rest.telephone,
          user: { connect: { email } },
        },
      });
    }

    // To update the user's role
    await prisma.user.update({
      where: { email },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      role,
      redirectTo: "/",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error while saving." }, { status: 500 });
  }
}
