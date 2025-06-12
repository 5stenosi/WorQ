import { NextRequest, NextResponse } from "next/server";

// Handles GET requests to /api/nominatim
// Return suggestions based on the query
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    var query = searchParams.get("q");

    // Validate the query parameter
    if (!query) {
        return NextResponse.json(
            { error: "Query parameter 'q' is required" },
            { status: 400 }
        );
    }

    try {
        // Fetch data from Nominatim API
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=3&addressdetails=1`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from Nominatim");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: `Error fetching data from Nominatim API: ${error}` },
            { status: 500 }
        );
    }
}
