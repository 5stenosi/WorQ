import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getMonthlyAvailability } from "@/lib/spaceAvailability";

// Handles GET requests to /api/spaces/[id]/availability?year=YYYY&month=MM
// Returns the availability of a space for a month
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const year = parseInt(request.nextUrl.searchParams.get("year") || "");
    const month = parseInt(request.nextUrl.searchParams.get("month") || "");

    const availableDates = await getMonthlyAvailability(parseInt(params.id), year, month);

    if (!availableDates) {
        return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ availableDates });
}   