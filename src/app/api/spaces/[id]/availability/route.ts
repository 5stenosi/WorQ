import { NextResponse, NextRequest } from "next/server";
import { getMonthlyAvailability } from "@/lib/spaceAvailability";

// Handles GET requests to /api/spaces/[id]/availability?year=YYYY&month=MM
// Returns the available dates for a specific space in a given month and year
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const year = parseInt(request.nextUrl.searchParams.get("year") || "");
  const month = parseInt(request.nextUrl.searchParams.get("month") || "");

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 });
  }

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: 'Invalid or missing space ID' }, { status: 400 });
  }

  const spaceId = parseInt(id);

  const availableDates = await getMonthlyAvailability(spaceId, year, month);

  if (!availableDates) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  return NextResponse.json({ availableDates });
}