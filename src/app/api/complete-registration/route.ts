import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { role, email, ...rest } = body;

  try {
    if (role === "CLIENT") {
      await prisma.client.create({
        data: {
          name: rest.name,
          surname: rest.surname,
          cellphone: rest.cellphone,
          user: { connect: { email } },
        },
      });
    } else if (role === "AGENCY") {
      await prisma.agency.create({
        data: {
          name: rest.name,
          vatNumber: rest.vatNumber,
          telephone: rest.telephone,
          user: { connect: { email } },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error while saving." }, { status: 500 });
  }
}
