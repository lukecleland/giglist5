import { NextRequest, NextResponse } from "next/server";
import { searchVenue } from "@/app/gigtools/api/queries-optimized";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const result = await searchVenue(query);
    const venues = JSON.parse(result);
    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error searching venues:", error);
    return NextResponse.json(
      { error: "Failed to search venues" },
      { status: 500 }
    );
  }
}
