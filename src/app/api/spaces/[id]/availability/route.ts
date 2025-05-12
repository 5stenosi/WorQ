import { NextResponse, NextRequest } from "next/server";
import { getMonthlyAvailability } from "@/lib/spaceAvailability";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const year = parseInt(request.nextUrl.searchParams.get("year") || "");
  const month = parseInt(request.nextUrl.searchParams.get("month") || "");

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 });
  }

  const spaceId = parseInt(params.id);

  const availableDates = await getMonthlyAvailability(spaceId, year, month);

  if (!availableDates) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  return NextResponse.json({ availableDates });
}